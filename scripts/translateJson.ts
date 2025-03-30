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
interface TranslationObject {
  [key: string]: TranslationValue;
}
type TranslationValue =
  | string
  | number
  | boolean
  | TranslationObject
  | TranslationArray;
type TranslationArray = TranslationValue[];

// Type guard: check if a value is a TranslationObject (plain object)
function isTranslationObject(
  value: TranslationValue
): value is TranslationObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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
  // Read the source language file
  const sourcePath: string = path.join(
    __dirname,
    '..',
    'messages',
    `${sourceLanguage}.json`
  );
  const sourceContent: string = fs.readFileSync(sourcePath, 'utf8');
  const sourceJson: TranslationObject = JSON.parse(sourceContent);

  // Calculate hash of source content for cache invalidation
  const contentHash = createHash('md5').update(sourceContent).digest('hex');

  // Check cache before translating
  const cachePath = path.join(
    __dirname,
    '..',
    'messages',
    '.translation-cache.json'
  );
  let cacheData: CacheData = {};

  if (fs.existsSync(cachePath)) {
    try {
      cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    } catch (e) {
      console.warn(
        chalk.yellow('⚠️ Failed to read cache file. Creating a new one.')
      );
    }
  }

  const cacheKey = `${sourceLanguage}-${targetLanguage}`;
  const cacheEntry = cacheData[cacheKey];
  const targetPath = path.join(
    __dirname,
    '..',
    'messages',
    `${targetLanguage}.json`
  );

  // Check if we can use cached translation
  if (
    !forceUpdate &&
    cacheEntry &&
    cacheEntry.hash === contentHash &&
    fs.existsSync(targetPath)
  ) {
    console.log(
      chalk.green(
        `Using cached translation for ${targetLanguage}. Last updated: ${new Date(
          cacheEntry.timestamp
        ).toLocaleString()}`
      )
    );
    return;
  }

  // If target file exists, do incremental translation
  let targetJson: TranslationObject = {};
  let shouldDoIncrementalTranslation = false;

  if (!forceUpdate && fs.existsSync(targetPath)) {
    try {
      const targetContent = fs.readFileSync(targetPath, 'utf8');
      targetJson = JSON.parse(targetContent);
      shouldDoIncrementalTranslation = true;
    } catch (e) {
      console.warn(
        chalk.yellow(
          `Failed to parse target file ${targetPath}. Will do full translation.`
        )
      );
    }
  }

  function countTextChanges(obj: TranslationObject): number {
    function traverse(value: TranslationValue): number {
      if (typeof value === 'string') {
        // Each string is a translatable change
        return 1;
      } else if (isTranslationObject(value)) {
        // For objects, traverse and count all children
        let subCount = 0;
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            subCount += traverse(value[key]);
          }
        }
        return subCount;
      } else if (Array.isArray(value)) {
        // For arrays, count each string item
        let arrayCount = 0;
        for (const item of value) {
          arrayCount += traverse(item);
        }
        return arrayCount;
      }
      // Numbers and booleans don't need translation
      return 0;
    }

    return traverse(obj);
  }

  // If doing incremental translation, find what needs to be translated
  if (shouldDoIncrementalTranslation) {
    const differences = findDifferences(sourceJson, targetJson);
    const actualChanges = countTextChanges(differences);

    // Skip translation if no actual text changes
    if (actualChanges === 0) {
      console.log(
        chalk.green('No translatable content detected, skipping translation')
      );
      // Update the hash in cache
      cacheData[cacheKey] = {
        hash: contentHash,
        timestamp: Date.now(),
        targetLanguage,
      };
      fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
      return;
    }

    // Since changes exist, show them once
    console.log(chalk.magenta(`\n🔍 Found changes in the following keys:`));
    logChanges(differences);
    console.log('');

    console.log(
      chalk.cyan(
        `Found ${Object.keys(differences).length} top-level keys with changes, containing ${actualChanges} actual text changes`
      )
    );

    console.log(
      chalk.magenta('Changed sections:', Object.keys(differences).join(', '))
    );

    // Only translate the differences
    const differencesString = JSON.stringify(differences, null, 2);
    console.log(
      chalk.blue(`Translating only changed content for ${targetLanguage}...`)
    );

    console.log(chalk.blue(`\n🔄 Translating to ${targetLanguage}...`));
    const startTime = Date.now();

    // Send only differences to OpenAI for translation
    const response: OpenAIResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following JSON content from ${sourceLanguage} to ${targetLanguage}. Preserve all JSON structure, keys, and formatting. Only translate the string values.`,
        },
        {
          role: 'user',
          content: `Translate ONLY these JSON parts to ${targetLanguage}:\n${differencesString}`,
        },
      ],
      temperature: 0.3,
    });

    // Extract the translated JSON from the response
    const translatedContent: string = response.choices[0].message.content || '';

    // Clean up the response to get just the JSON
    let jsonContent: string = translatedContent;
    if (jsonContent.includes('```json')) {
      jsonContent = jsonContent.split('```json')[1].split('```')[0].trim();
    } else if (jsonContent.includes('```')) {
      jsonContent = jsonContent.split('```')[1].split('```')[0].trim();
    }

    const translationTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(chalk.green(`✅ Translation completed in ${translationTime}s`));

    // Validate and merge the partial translation
    try {
      const translatedPartial: TranslationObject = JSON.parse(jsonContent);
      const mergedTranslation = deepMerge(
        targetJson,
        translatedPartial
      ) as TranslationObject;
      const formattedJson: string = JSON.stringify(mergedTranslation, null, 2);

      // Write merged translation to target language file
      fs.writeFileSync(targetPath, formattedJson);

      console.log(
        chalk.green(
          `✅ File saved successfully (${(formattedJson.length / 1024).toFixed(2)} KB)`
        )
      );

      // Update cache with new hash
      cacheData[cacheKey] = {
        hash: contentHash,
        timestamp: Date.now(),
        targetLanguage,
      };
      fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));

      console.log(
        `\n${'-'.repeat(50)}\n${chalk.blue(
          `Summary for ${targetLanguage.toUpperCase()}`
        )}\n${'-'.repeat(50)}`
      );
      console.log(chalk.blue(`• Translation mode: Incremental`));
      console.log(
        chalk.blue(
          `• Total changes: ${Object.keys(differences).length} top-level sections`
        )
      );
      console.log(chalk.blue(`• Translation time: ${translationTime}s`));
      console.log(
        chalk.blue(`• Cache updated: ${new Date().toLocaleString()}`)
      );
      console.log(`${'-'.repeat(50)}\n`);
    } catch (e) {
      console.error(chalk.red('Error parsing incremental translation:'), e);
      console.log(chalk.yellow('Falling back to full translation...'));
      shouldDoIncrementalTranslation = false;
    }
  }

  // If we need to do a full translation (forced or incremental failed)
  if (!shouldDoIncrementalTranslation || forceUpdate) {
    console.log(
      chalk.blue(
        `Performing full translation from ${sourceLanguage} to ${targetLanguage}...`
      )
    );

    // Send to OpenAI for translation
    const response: OpenAIResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following JSON content from ${sourceLanguage} to ${targetLanguage}. Preserve all JSON structure, keys, and formatting. Only translate the string values.`,
        },
        {
          role: 'user',
          content: `Translate this JSON to ${targetLanguage}:\n${sourceContent}`,
        },
      ],
      temperature: 0.3,
    });

    // Extract the translated JSON from the response
    const translatedContent: string = response.choices[0].message.content || '';

    // Clean up the response to get just the JSON
    let jsonContent: string = translatedContent;
    if (jsonContent.includes('```json')) {
      jsonContent = jsonContent.split('```json')[1].split('```')[0].trim();
    } else if (jsonContent.includes('```')) {
      jsonContent = jsonContent.split('```')[1].split('```')[0].trim();
    }

    // Validate and format the JSON
    try {
      const translatedJson: TranslationObject = JSON.parse(jsonContent);
      const formattedJson: string = JSON.stringify(translatedJson, null, 2);

      // Write to target language file
      fs.writeFileSync(targetPath, formattedJson);

      // Update cache
      cacheData[cacheKey] = {
        hash: contentHash,
        timestamp: Date.now(),
        targetLanguage,
      };
      fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));

      console.log(
        chalk.green(`Full translation complete! File saved to ${targetPath}`)
      );
    } catch (e) {
      console.error(chalk.red('Error parsing translated JSON:'), e);
      // Save the raw response for debugging
      const debugPath: string = path.join(
        __dirname,
        '..',
        'messages',
        `${targetLanguage}_debug.txt`
      );
      fs.writeFileSync(debugPath, translatedContent);
      console.error(
        chalk.red(`Raw response saved to ${debugPath} for debugging`)
      );
    }
  }
}

// Helper function to find differences between two TranslationObjects
function findDifferences(
  source: TranslationObject,
  target: TranslationObject
): TranslationObject {
  const differences: TranslationObject = {};

  if (!target) {
    return source;
  }

  for (const key in source) {
    if (!source.hasOwnProperty(key)) continue;
    const sourceValue = source[key];
    const targetValue = target[key];

    if (typeof sourceValue === 'string') {
      if (sourceValue !== targetValue) {
        differences[key] = sourceValue;
      }
    } else if (Array.isArray(sourceValue)) {
      if (JSON.stringify(sourceValue) !== JSON.stringify(targetValue)) {
        differences[key] = sourceValue;
      }
    } else if (isTranslationObject(sourceValue)) {
      const nestedDiffs = findDifferences(
        sourceValue,
        isTranslationObject(targetValue) ? targetValue : {}
      );
      if (Object.keys(nestedDiffs).length > 0) {
        differences[key] = nestedDiffs;
      }
    } else {
      if (sourceValue !== targetValue) {
        differences[key] = sourceValue;
      }
    }
  }

  return differences;
}

// Define the exportHashes function
function exportHashes(): void {
  console.log(
    chalk.blue(
      'Exporting translation hashes for client-side cache validation...'
    )
  );

  const cachePath = path.join(
    __dirname,
    '..',
    'messages',
    '.translation-cache.json'
  );

  if (!fs.existsSync(cachePath)) {
    console.warn(
      chalk.yellow('⚠️ No translation cache found. Run translations first.')
    );
    return;
  }

  try {
    const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    const hashes: Record<string, string> = {};

    const languages = ['fr', 'es', 'pt', 'en'];
    languages.forEach((lang) => {
      if (lang === 'en') {
        const enPath = path.join(__dirname, '..', 'messages', 'en.json');
        if (fs.existsSync(enPath)) {
          const enContent = fs.readFileSync(enPath, 'utf8');
          hashes[lang] = createHash('md5').update(enContent).digest('hex');
        } else {
          console.warn(chalk.yellow('⚠️ English source file not found'));
        }
      } else {
        const sourceKey = 'en';
        const cacheKey = `${sourceKey}-${lang}`;
        if (cacheData[cacheKey]) {
          hashes[lang] = cacheData[cacheKey].hash;
        } else {
          console.warn(
            chalk.yellow(
              `⚠️ No hash found for ${lang}. Translation may be missing.`
            )
          );
        }
      }
    });

    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(
      path.join(publicDir, 'translation-hashes.json'),
      JSON.stringify(hashes, null, 2)
    );

    console.log(
      chalk.green(
        '✅ Translation hashes exported successfully to public/translation-hashes.json'
      )
    );
    console.log(chalk.green('Hashes:'), JSON.stringify(hashes, null, 2));
  } catch (error) {
    console.error(chalk.red('❌ Failed to export translation hashes:'), error);
  }
}

// Define the main translation function
async function main() {
  const sourceLanguage = process.argv[2] || 'en';
  const providedTargetLanguage = process.argv[3];
  const forceUpdate = process.argv.includes('--force');
  const availableLanguages = ['fr', 'es', 'pt'];

  if (!providedTargetLanguage) {
    console.log(
      chalk.blue(
        `No target language provided. Translating from ${sourceLanguage} to all available languages: ${availableLanguages.join(', ')}`
      )
    );
    for (const lang of availableLanguages) {
      await translateJson(sourceLanguage, lang, forceUpdate);
    }
  } else {
    await translateJson(sourceLanguage, providedTargetLanguage, forceUpdate);
  }
}

// Check command-line arguments
if (process.argv.includes('--export-hashes')) {
  exportHashes();
} else {
  main().catch((err: Error | unknown) => {
    console.error(chalk.red('Translation error:'), err);
    process.exit(1);
  });
}
