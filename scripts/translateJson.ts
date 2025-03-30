const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { createHash } = require('crypto');
const chalk = require('chalk');

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OpenAIResponse {
  choices: {
    message: {
      content: string | null;
    };
  }[];
}

interface CacheEntry {
  hash: string;
  timestamp: number;
  targetLanguage: string;
}

interface CacheData {
  [key: string]: CacheEntry;
}

type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

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
    // This is the wrong check - change from AND to NOT
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

// Deep merge two TranslationObjects. If either value is not an object, return source.
function deepMerge(
  target: TranslationValue,
  source: TranslationValue
): TranslationValue {
  if (isTranslationObject(target) && isTranslationObject(source)) {
    const output: TranslationObject = { ...target };
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (key in target) {
          output[key] = deepMerge(target[key], source[key]);
        } else {
          output[key] = source[key];
        }
      }
    }
    return output;
  }
  // If either is not an object, return source
  return source;
}

// Helper function to log changes in a nested structure.
// It checks if a value is an object, array, or string before performing operations.
function logChanges(obj: TranslationObject, prefix = ''): void {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Handle different types with proper type checking
      if (isTranslationObject(value)) {
        logChanges(value, prefix ? `${prefix}.${key}` : key);
      } else if (Array.isArray(value)) {
        console.log(
          chalk.yellow(
            `📝 ${prefix ? `${prefix}.${key}` : key}: [array with ${value.length} items]`
          )
        );
      } else if (typeof value === 'string') {
        const preview =
          value.length > 40 ? `${value.substring(0, 40)}...` : value;
        console.log(
          chalk.yellow(`📝 ${prefix ? `${prefix}.${key}` : key}: "${preview}"`)
        );
      } else {
        // For numbers or booleans, just log the value directly
        console.log(
          chalk.yellow(`📝 ${prefix ? `${prefix}.${key}` : key}: ${value}`)
        );
      }
    }
  }
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
  forceUpdate: boolean = false
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
    currentPath: string = ''
  ): Promise<void> {
    for (const key in source) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;
      const sourceValue = source[key];

      // If it's a nested object, process recursively
      if (isTranslationObject(sourceValue)) {
        // Make sure existing[key] is an object before recursion
        if (!isTranslationObject(existing[key])) {
          // Initialize as empty object if it's not an object
          existing[key] = {};
        }
        // Type assertion to ensure TypeScript knows this is a TranslationObject
        await processEntries(
          sourceValue,
          existing[key] as TranslationObject,
          fullPath
        );
        continue;
      }

      // Handle string values that need translation
      const existingEntry = existing[key];

      // If no translation exists yet or force update is enabled
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

      // If it's already a translation entry with sourceMessage tracking
      if (isTranslationEntry(existingEntry)) {
        // Check if source text changed or force update
        if (!areValuesEqual(existingEntry.sourceMessage, sourceValue)) {
          updatedCount++;
          console.log(chalk.yellow(`↻ Updated (source changed): ${fullPath}`));
          setNestedValue(pendingTranslations, fullPath.split('.'), sourceValue);
        } else {
          unchangedCount++;
        }
        continue;
      }

      // Simple string value - needs metadata upgrade
      updatedCount++;
      console.log(chalk.blue(`📝 Added source tracking: ${fullPath}`));
      setNestedValue(pendingTranslations, fullPath.split('.'), sourceValue);
    }
  }
  // Process all entries
  await processEntries(sourceJson, existingTranslations);

  // If nothing to translate, we're done
  if (Object.keys(flattenObject(pendingTranslations)).length === 0) {
    console.log(chalk.green('✅ No changes to translate'));

    // Write the final clean version
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

  // Translate pending changes
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

  // Process response
  const translatedContent = response.choices[0].message.content || '';
  let jsonContent = extractJsonFromResponse(translatedContent);

  // Update translations with new content
  try {
    const translatedValues = JSON.parse(jsonContent);

    // Merge translations with metadata
    mergeTranslations(
      translatedValues,
      pendingTranslations,
      existingTranslations
    );

    // Save to pre folder with metadata
    const preFilePath = path.join(PRE_FOLDER, `${targetLanguage}.json`);
    fs.writeFileSync(
      preFilePath,
      JSON.stringify(existingTranslations, null, 2)
    );

    // Create clean version for production use
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

// Helper function to flatten a nested object
function flattenObject(
  obj: TranslationObject,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in obj) {
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      const nestedObj = flattenObject(
        obj[key] as TranslationObject,
        prefix ? `${prefix}.${key}` : key
      );
      Object.assign(result, nestedObj);
    } else {
      result[prefix ? `${prefix}.${key}` : key] = String(obj[key]);
    }
  }

  return result;
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

// Get value from nested path
function getNestedValue(
  obj: TranslationObject,
  path: string[]
): TranslationValue | undefined {
  let current: TranslationValue = obj;
  for (const key of path) {
    if (!current || typeof current !== 'object' || Array.isArray(current))
      return undefined;
    current = (current as TranslationObject)[key];
  }
  return current;
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

// Main execution code
async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  const sourceLanguage = args[0] || 'en';
  const targetLanguages = args[1] ? args[1].split(',') : ['fr', 'es', 'pt'];
  const forceUpdate = args.includes('--force');

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
