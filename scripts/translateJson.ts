const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { createHash } = require('crypto');

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

// Add helper function to extract differences between objects
function findDifferences(source: any, target: any): any {
  const differences: any = {};

  // Handle case where target doesn't exist yet
  if (!target) {
    return source;
  }

  // Compare each key in the source object
  for (const key in source) {
    // If key doesn't exist in target, add it
    if (!(key in target)) {
      differences[key] = source[key];
      continue;
    }

    // If it's a string value that differs
    if (typeof source[key] === 'string' && source[key] !== target[key]) {
      differences[key] = source[key];
    }
    // If it's an array
    else if (Array.isArray(source[key])) {
      // Deep compare arrays
      if (JSON.stringify(source[key]) !== JSON.stringify(target[key])) {
        differences[key] = source[key];
      }
    }
    // If it's a nested object
    else if (typeof source[key] === 'object' && source[key] !== null) {
      const nestedDiffs = findDifferences(source[key], target[key]);
      if (Object.keys(nestedDiffs).length > 0) {
        differences[key] = nestedDiffs;
      }
    }
  }

  return differences;
}

// Add helper function for deep merging
function deepMerge(target: any, source: any): any {
  const output = { ...target };

  for (const key in source) {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      if (
        key in target &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

// Helper function to log changes in a nested structure
function logChanges(obj: any, prefix = '') {
  for (const key in obj) {
    if (
      typeof obj[key] === 'object' &&
      !Array.isArray(obj[key]) &&
      obj[key] !== null
    ) {
      logChanges(obj[key], prefix ? `${prefix}.${key}` : key);
    } else if (Array.isArray(obj[key])) {
      console.log(
        `📝 ${prefix ? `${prefix}.${key}` : key}: [array with ${obj[key].length} items]`
      );
    } else {
      const preview =
        typeof obj[key] === 'string'
          ? obj[key].length > 40
            ? `${obj[key].substring(0, 40)}...`
            : obj[key]
          : obj[key];
      console.log(`📝 ${prefix ? `${prefix}.${key}` : key}: "${preview}"`);
    }
  }
}

async function translateJson(
  sourceLanguage: string,
  targetLanguage: string,
  forceUpdate: boolean = false
): Promise<void> {
  console.log(
    `\n${'-'.repeat(50)}\nProcessing ${targetLanguage.toUpperCase()} translations\n${'-'.repeat(50)}`
  );
  // Read the source language file
  const sourcePath: string = path.join(
    __dirname,
    '..',
    'messages',
    `${sourceLanguage}.json`
  );
  const sourceContent: string = fs.readFileSync(sourcePath, 'utf8');
  const sourceJson = JSON.parse(sourceContent);

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
      console.warn('Failed to read cache file. Creating a new one.');
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

  // Check if we can use cached translation - no changes at all
  if (
    !forceUpdate &&
    cacheEntry &&
    cacheEntry.hash === contentHash &&
    fs.existsSync(targetPath)
  ) {
    console.log(
      `Using cached translation for ${targetLanguage}. Last updated: ${new Date(cacheEntry.timestamp).toLocaleString()}`
    );
    return;
  }

  // If target file exists, we can do incremental translation
  let targetJson: any = {};
  let shouldDoIncrementalTranslation = false;

  if (!forceUpdate && fs.existsSync(targetPath)) {
    try {
      const targetContent = fs.readFileSync(targetPath, 'utf8');
      targetJson = JSON.parse(targetContent);
      shouldDoIncrementalTranslation = true;
    } catch (e) {
      console.warn(
        `Failed to parse target file ${targetPath}. Will do full translation.`
      );
    }
  }

  // If doing incremental translation, find what needs to be translated
  if (shouldDoIncrementalTranslation) {
    const differences = findDifferences(sourceJson, targetJson);

    if (Object.keys(differences).length === 0) {
      console.log(
        `No actual content differences for ${targetLanguage}, but hash changed. Updating cache only.`
      );

      // Update cache with new hash
      cacheData[cacheKey] = {
        hash: contentHash,
        timestamp: Date.now(),
        targetLanguage,
      };
      fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
      return;
    }

    if (Object.keys(differences).length > 0) {
      console.log(`\n🔍 Found changes in the following keys:`);
      logChanges(differences);
      console.log('');
    }

    console.log(
      `Found ${Object.keys(differences).length} top-level keys with changes in ${targetLanguage}`
    );
    console.log('Changed sections:', Object.keys(differences).join(', '));

    // Only translate the differences
    const differencesString = JSON.stringify(differences, null, 2);
    console.log(`Translating only changed content for ${targetLanguage}...`);

    console.log(`\n🔄 Translating to ${targetLanguage}...`);
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
    console.log(`✅ Translation completed in ${translationTime}s`);

    // Validate and merge the partial translation
    try {
      const translatedPartial: Record<string, unknown> =
        JSON.parse(jsonContent);

      // Merge with existing translation
      const mergedTranslation = deepMerge(targetJson, translatedPartial);
      const formattedJson: string = JSON.stringify(mergedTranslation, null, 2);

      // Write merged translation to target language file
      fs.writeFileSync(targetPath, formattedJson);

      console.log(
        `✅ File saved successfully (${(formattedJson.length / 1024).toFixed(2)} KB)`
      );

      // Update cache with new hash
      cacheData[cacheKey] = {
        hash: contentHash,
        timestamp: Date.now(),
        targetLanguage,
      };
      fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));

      console.log(
        `\n${'-'.repeat(50)}\nSummary for ${targetLanguage.toUpperCase()}\n${'-'.repeat(50)}`
      );
      console.log(`• Translation mode: Incremental`);
      console.log(
        `• Total changes: ${Object.keys(differences).length} top-level sections`
      );
      console.log(`• Translation time: ${translationTime}s`);
      console.log(`• Cache updated: ${new Date().toLocaleString()}`);
      console.log(`${'-'.repeat(50)}\n`);
    } catch (e) {
      console.error('Error parsing incremental translation:', e);
      console.log('Falling back to full translation...');
      // Fall back to full translation
      shouldDoIncrementalTranslation = false;
    }
  }

  // If we need to do a full translation (forced or incremental failed)
  if (!shouldDoIncrementalTranslation || forceUpdate) {
    console.log(
      `Performing full translation from ${sourceLanguage} to ${targetLanguage}...`
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
      const translatedJson: Record<string, unknown> = JSON.parse(jsonContent);
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

      console.log(`Full translation complete! File saved to ${targetPath}`);
    } catch (e) {
      console.error('Error parsing translated JSON:', e);
      // Save the raw response for debugging
      const debugPath: string = path.join(
        __dirname,
        '..',
        'messages',
        `${targetLanguage}_debug.txt`
      );
      fs.writeFileSync(debugPath, translatedContent);
      console.error(`Raw response saved to ${debugPath} for debugging`);
    }
  }
}

// Define the exportHashes function
function exportHashes(): void {
  console.log(
    'Exporting translation hashes for client-side cache validation...'
  );

  // Read the translation cache
  const cachePath = path.join(
    __dirname,
    '..',
    'messages',
    '.translation-cache.json'
  );

  if (!fs.existsSync(cachePath)) {
    console.warn('⚠️ No translation cache found. Run translations first.');
    return;
  }

  try {
    const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    const hashes: Record<string, string> = {};

    // Extract just the hashes for each language
    const languages = ['fr', 'es', 'pt', 'en'];
    languages.forEach((lang) => {
      if (lang === 'en') {
        // Calculate hash directly from the English file
        const enPath = path.join(__dirname, '..', 'messages', 'en.json');
        if (fs.existsSync(enPath)) {
          const enContent = fs.readFileSync(enPath, 'utf8');
          hashes[lang] = createHash('md5').update(enContent).digest('hex');
        } else {
          console.warn('⚠️ English source file not found');
        }
      } else {
        // Normal handling for translated languages
        const sourceKey = 'en';
        const cacheKey = `${sourceKey}-${lang}`;

        if (cacheData[cacheKey]) {
          hashes[lang] = cacheData[cacheKey].hash;
        } else {
          console.warn(
            `⚠️ No hash found for ${lang}. Translation may be missing.`
          );
        }
      }
    });

    // Ensure public directory exists
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    // Write the hashes to a file in public directory
    fs.writeFileSync(
      path.join(publicDir, 'translation-hashes.json'),
      JSON.stringify(hashes, null, 2)
    );

    console.log(
      '✅ Translation hashes exported successfully to public/translation-hashes.json'
    );
    console.log('Hashes:', JSON.stringify(hashes, null, 2));
  } catch (error) {
    console.error('❌ Failed to export translation hashes:', error);
  }
}

// Define the main translation function
async function main() {
  // Get command line arguments for translation
  const sourceLanguage = process.argv[2] || 'en';
  const providedTargetLanguage = process.argv[3];
  const forceUpdate = process.argv.includes('--force');

  // Define your available target languages
  const availableLanguages = ['fr', 'es', 'pt'];

  if (!providedTargetLanguage) {
    console.log(
      `No target language provided. Translating from ${sourceLanguage} to all available languages: ${availableLanguages.join(', ')}`
    );
    for (const lang of availableLanguages) {
      await translateJson(sourceLanguage, lang, forceUpdate);
    }
  } else {
    await translateJson(sourceLanguage, providedTargetLanguage, forceUpdate);
  }
}

// Check for command line arguments to determine what to execute
if (process.argv.includes('--export-hashes')) {
  // Run hash export function
  exportHashes();
} else {
  // Run translation function
  main().catch((err: any) => {
    console.error('Translation error:', err);
    process.exit(1);
  });
}
