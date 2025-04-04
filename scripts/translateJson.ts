import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// For translation-specific JSON objects
interface TranslationEntry {
  defaultMessage: string;
  sourceMessage: string;
}

interface TranslationObject {
  [key: string]: TranslationValue | TranslationEntry;
}

type TranslationValue =
  | string
  | number
  | boolean
  | TranslationObject
  | TranslationArray
  | TranslationEntry;

type TranslationArray = TranslationValue[];

const PRE_FOLDER = path.join(__dirname, '..', 'messages', 'pre');

if (!fs.existsSync(PRE_FOLDER)) {
  fs.mkdirSync(PRE_FOLDER, { recursive: true });
}

// Type guard: check if a value is a TranslationObject (plain object)
function isTranslationObject(
  value: TranslationValue | TranslationEntry | undefined
): value is TranslationObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !('defaultMessage' in value && 'sourceMessage' in value)
  );
}

// Add a separate helper to detect TranslationEntry objects:
function isTranslationEntry(
  value: TranslationValue | TranslationEntry | undefined
): value is TranslationEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'defaultMessage' in value &&
    'sourceMessage' in value
  );
}

// Helper function to check if two values are deeply equal
function areValuesEqual(
  a: TranslationValue | undefined,
  b: TranslationValue | undefined
): boolean {
  // Handle undefined or null
  if (a === undefined || a === null || b === undefined || b === null) {
    return a === b;
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => areValuesEqual(item, b[index]));
  }

  // Handle objects (but not arrays)
  if (
    typeof a === 'object' &&
    !Array.isArray(a) &&
    typeof b === 'object' &&
    !Array.isArray(b)
  ) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) =>
      areValuesEqual(
        (a as TranslationObject)[key],
        (b as TranslationObject)[key]
      )
    );
  }

  // Handle primitives
  return a === b;
}

// Get existing translations with metadata
async function getExistingTranslations(
  locale: string
): Promise<TranslationObject> {
  try {
    const filePath = path.join(PRE_FOLDER, `${locale}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.log(chalk.yellow(`No existing translations found for ${locale}`));
  }
  return {};
}

// Replace your translateJson function with this simplified version
async function translateJson(
  sourceLanguage: string,
  targetLanguage: string,
  forceUpdate = false
): Promise<void> {
  console.log(
    `\n${'-'.repeat(50)}\n${chalk.blue(
      `Processing ${targetLanguage.toUpperCase()} translations`
    )}\n${'-'.repeat(50)}`
  );

  // Read source language file (original English)
  const sourcePath = path.join(
    __dirname,
    '..',
    'messages',
    `${sourceLanguage}.json`
  );
  const sourceJson = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  // Get existing translations with metadata
  const existingTranslations = await getExistingTranslations(targetLanguage);

  // Track translation stats
  let newCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;
  const pendingTranslations: TranslationObject = {};

  // Process all keys recursively
  async function processEntries(
    source: TranslationObject,
    existing: TranslationObject,
    currentPath = ''
  ): Promise<void> {
    for (const key in source) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;
      const sourceValue = source[key];

      // If it's a nested object, process recursively
      if (isTranslationObject(sourceValue)) {
        if (!isTranslationObject(existing[key])) {
          // Initialize as empty object if it's not an object
          existing[key] = {};
        }
        await processEntries(
          sourceValue,
          existing[key] as TranslationObject,
          fullPath
        );
        continue;
      }

      // Handle string values that need translation
      const existingEntry = existing[key];

      if (!existingEntry || forceUpdate) {
        if (!existingEntry) {
          newCount++;
          console.log(chalk.green(`+ New: ${fullPath}`));
        } else {
          updatedCount++;
          console.log(chalk.magenta(`↻ Force updated: ${fullPath}`));
        }
        setNestedValue(pendingTranslations, fullPath.split('.'), sourceValue);
        continue;
      }

      if (isTranslationEntry(existingEntry)) {
        if (!areValuesEqual(existingEntry.sourceMessage, sourceValue)) {
          updatedCount++;
          console.log(chalk.yellow(`↻ Updated (source changed): ${fullPath}`));
          setNestedValue(pendingTranslations, fullPath.split('.'), sourceValue);
        } else {
          unchangedCount++;
        }
        continue;
      }

      updatedCount++;
      console.log(chalk.blue(`📝 Added source tracking: ${fullPath}`));
      setNestedValue(pendingTranslations, fullPath.split('.'), sourceValue);
    }
  }

  await processEntries(sourceJson, existingTranslations);

  if (Object.keys(pendingTranslations).length === 0) {
    console.log(chalk.green('✅ No changes to translate'));
    compileCleanTranslation(existingTranslations, targetLanguage);
    console.log(
      `\n${'-'.repeat(50)}\n${chalk.blue(
        `Summary for ${targetLanguage.toUpperCase()}`
      )}\n${'-'.repeat(50)}`
    );
    console.log(chalk.blue(`• New translations: ${newCount}`));
    console.log(chalk.blue(`• Updated translations: ${updatedCount}`));
    console.log(chalk.blue(`• Unchanged translations: ${unchangedCount}`));
    console.log(`${'-'.repeat(50)}\n`);
    return;
  }

  console.log(chalk.blue(`\n🔄 Translating to ${targetLanguage}...`));
  const startTime = Date.now();

  const pendingString = JSON.stringify(pendingTranslations, null, 2);
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the following JSON content from ${sourceLanguage} to ${targetLanguage}. 
        Preserve all JSON structure, keys, and formatting. Only translate the string values.`,
      },
      {
        role: 'user',
        content: `Translate ONLY these JSON parts to ${targetLanguage}:\n${pendingString}`,
      },
    ],
    temperature: 0.3,
  });

  const translatedContent = response.choices[0].message.content || '';
  const jsonContent = extractJsonFromResponse(translatedContent);

  try {
    const translatedValues = JSON.parse(jsonContent);

    mergeTranslations(
      translatedValues,
      pendingTranslations,
      existingTranslations
    );

    const preFilePath = path.join(PRE_FOLDER, `${targetLanguage}.json`);
    fs.writeFileSync(
      preFilePath,
      JSON.stringify(existingTranslations, null, 2)
    );

    compileCleanTranslation(existingTranslations, targetLanguage);

    const translationTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(chalk.green(`✅ Translation completed in ${translationTime}s`));

    console.log(
      `\n${'-'.repeat(50)}\n${chalk.blue(
        `Summary for ${targetLanguage.toUpperCase()}`
      )}\n${'-'.repeat(50)}`
    );
    console.log(chalk.blue(`• New translations: ${newCount}`));
    console.log(chalk.blue(`• Updated translations: ${updatedCount}`));
    console.log(chalk.blue(`• Unchanged translations: ${unchangedCount}`));
    console.log(chalk.blue(`• Translation time: ${translationTime}s`));
    console.log(`${'-'.repeat(50)}\n`);
  } catch (error) {
    console.error(chalk.red('Error processing translation:'), error);
  }
}

// Helper to set a value in a nested object structure
function setNestedValue(
  obj: TranslationObject,
  path: string[],
  value: TranslationValue
): void {
  const key = path[0];
  if (path.length === 1) {
    obj[key] = value;
    return;
  }

  if (!obj[key] || typeof obj[key] !== 'object') {
    obj[key] = {};
  }

  setNestedValue(obj[key] as TranslationObject, path.slice(1), value);
}

// Helper to get a value from a nested object structure
function getNestedValue(
  obj: TranslationObject,
  path: string[]
): TranslationValue | undefined {
  let current: TranslationValue | undefined = obj;
  for (const key of path) {
    if (
      current &&
      typeof current === 'object' &&
      !Array.isArray(current) &&
      key in current
    ) {
      current = (current as TranslationObject)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

// Extract JSON from OpenAI response
function extractJsonFromResponse(response: string): string {
  try {
    // First check if the entire response is valid JSON
    JSON.parse(response);
    return response;
  } catch (e) {
    // Try to extract JSON from markdown code blocks
    if (response.includes('```json')) {
      return response.split('```json')[1].split('```')[0].trim();
    } else if (response.includes('```')) {
      return response.split('```')[1].split('```')[0].trim();
    }

    // Last resort: try to find JSON-like content
    const jsonMatch = response.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) return jsonMatch[0];

    return response;
  }
}

// Merge translations with metadata
function mergeTranslations(
  translated: TranslationObject,
  source: TranslationObject,
  target: TranslationObject,
  path: string[] = []
): void {
  for (const key in source) {
    const currentPath = [...path, key];
    const sourceValue = source[key];
    const translatedValue = getNestedValue(translated, currentPath);

    if (isTranslationObject(sourceValue) && !('sourceMessage' in sourceValue)) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      mergeTranslations(
        translated,
        sourceValue as TranslationObject,
        target[key] as TranslationObject,
        currentPath
      );
    } else if (translatedValue !== undefined) {
      // Store as enhanced object with source tracking
      target[key] = {
        defaultMessage: translatedValue as string,
        sourceMessage: sourceValue as string,
      };
    }
  }
}

// Compile clean version without metadata
function compileCleanTranslation(
  withMetadata: TranslationObject,
  locale: string
): void {
  function extractMessages(obj: TranslationObject): TranslationObject {
    const result: TranslationObject = {};

    for (const key in obj) {
      const value = obj[key];

      if (isTranslationObject(value)) {
        if ('defaultMessage' in value) {
          // It's a translation entry with metadata
          result[key] = value.defaultMessage;
        } else {
          // It's a nested object
          result[key] = extractMessages(value);
        }
      } else {
        // It's a direct value (array, number, etc)
        result[key] = value;
      }
    }

    return result;
  }

  const cleanJson = extractMessages(withMetadata);
  const finalPath = path.join(__dirname, '..', 'messages', `${locale}.json`);
  fs.writeFileSync(finalPath, JSON.stringify(cleanJson, null, 2));

  console.log(chalk.green(`✅ Clean translation file saved to ${finalPath}`));
}

function createSourcePreFile(sourceLanguage: string): void {
  console.log(
    chalk.blue(`Creating pre file for source language (${sourceLanguage})...`)
  );

  try {
    // Read source language file
    const sourcePath = path.join(
      __dirname,
      '..',
      'messages',
      `${sourceLanguage}.json`
    );
    const sourceJson = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

    // Convert to pre format with defaultMessage/sourceMessage structure
    function convertToPre(obj: TranslationObject): TranslationObject {
      const result: TranslationObject = {};

      for (const key in obj) {
        const value = obj[key];

        if (typeof value === 'string') {
          // Convert string values to TranslationEntry format
          result[key] = {
            defaultMessage: value,
            sourceMessage: value,
          };
        } else if (Array.isArray(value)) {
          // Keep arrays as-is
          result[key] = value;
        } else if (isTranslationObject(value)) {
          // Recursively process nested objects
          result[key] = convertToPre(value as TranslationObject);
        } else {
          // Keep other types (numbers, booleans) as-is
          result[key] = value;
        }
      }

      return result;
    }

    const preJson = convertToPre(sourceJson);

    // Save to pre folder
    const preFilePath = path.join(PRE_FOLDER, `${sourceLanguage}.json`);
    fs.writeFileSync(preFilePath, JSON.stringify(preJson, null, 2));

    console.log(chalk.green(`✅ Source pre file created at ${preFilePath}`));
  } catch (error) {
    console.error(chalk.red(`Error creating source pre file:`), error);
  }
}

// Main execution code
async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  const sourceLanguage = args[0] || 'en';
  const targetLanguages = args[1] ? args[1].split(',') : ['fr', 'es', 'pt'];
  const forceUpdate = args.includes('--force');

  // Create pre directory if it doesn't exist
  if (!fs.existsSync(PRE_FOLDER)) {
    fs.mkdirSync(PRE_FOLDER, { recursive: true });
  }

  // First, create pre file for source language (usually English)
  createSourcePreFile(sourceLanguage);

  console.log(
    `No target language provided. Translating from ${sourceLanguage} to all available languages: ${targetLanguages.join(', ')}`
  );

  // Process each target language
  for (const lang of targetLanguages) {
    try {
      await translateJson(sourceLanguage, lang, forceUpdate);
    } catch (error) {
      console.error(chalk.red(`Error processing ${lang}:`), error);
    }
  }
}

// Run the script
main().catch((error) => {
  console.error(chalk.red('Translation process failed:'), error);
  process.exit(1);
});
