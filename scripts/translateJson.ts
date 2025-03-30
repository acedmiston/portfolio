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

async function translateJson(
  sourceLanguage: string,
  targetLanguage: string,
  forceUpdate: boolean = false
): Promise<void> {
  // Read the source language file
  const sourcePath: string = path.join(
    __dirname,
    '..',
    'messages',
    `${sourceLanguage}.json`
  );
  const sourceContent: string = fs.readFileSync(sourcePath, 'utf8');

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

  // Check if we can use cached translation
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

  console.log(`Translating from ${sourceLanguage} to ${targetLanguage}...`);

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

    // Log the formatted translation for readability
    console.log(`\nTranslated JSON for ${targetLanguage}:\n${formattedJson}\n`);

    // Write to target language file
    fs.writeFileSync(targetPath, formattedJson);

    // Update cache
    cacheData[cacheKey] = {
      hash: contentHash,
      timestamp: Date.now(),
      targetLanguage,
    };

    fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));

    console.log(`Translation complete! File saved to ${targetPath}`);
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

// Get command line arguments
const sourceLanguage = process.argv[2] || 'en';
const providedTargetLanguage = process.argv[3];
const forceUpdate = process.argv.includes('--force');

// Define your available target languages
const availableLanguages = ['fr', 'es', 'pt'];

async function main() {
  if (!providedTargetLanguage) {
    console.log(
      `No target language provided. Translating from ${sourceLanguage} to all available languages: ${availableLanguages.join(
        ', '
      )}`
    );
    for (const lang of availableLanguages) {
      await translateJson(sourceLanguage, lang, forceUpdate);
    }
  } else {
    await translateJson(sourceLanguage, providedTargetLanguage, forceUpdate);
  }
}

main().catch((err: any) => {
  console.error('Translation error:', err);
  process.exit(1);
});
