"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var chalk_1 = require("chalk");
var openai_1 = require("openai");
var dotenv_1 = require("dotenv");
dotenv_1.default.config({ path: '.env.local' });
var openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
var PRE_FOLDER = path_1.default.join(__dirname, '..', 'messages', 'pre');
if (!fs_1.default.existsSync(PRE_FOLDER)) {
    fs_1.default.mkdirSync(PRE_FOLDER, { recursive: true });
}
// Type guard: check if a value is a TranslationObject (plain object)
function isTranslationObject(value) {
    return (typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        !('defaultMessage' in value && 'sourceMessage' in value));
}
// Add a separate helper to detect TranslationEntry objects:
function isTranslationEntry(value) {
    return (typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        'defaultMessage' in value &&
        'sourceMessage' in value);
}
// Helper function to check if two values are deeply equal
function areValuesEqual(a, b) {
    // Handle undefined or null
    if (a === undefined || a === null || b === undefined || b === null) {
        return a === b;
    }
    // Handle arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length)
            return false;
        return a.every(function (item, index) { return areValuesEqual(item, b[index]); });
    }
    // Handle objects (but not arrays)
    if (typeof a === 'object' &&
        !Array.isArray(a) &&
        typeof b === 'object' &&
        !Array.isArray(b)) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        if (keysA.length !== keysB.length)
            return false;
        return keysA.every(function (key) {
            return areValuesEqual(a[key], b[key]);
        });
    }
    // Handle primitives
    return a === b;
}
// Get existing translations with metadata
function getExistingTranslations(locale) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, content;
        return __generator(this, function (_a) {
            try {
                filePath = path_1.default.join(PRE_FOLDER, "".concat(locale, ".json"));
                if (fs_1.default.existsSync(filePath)) {
                    content = fs_1.default.readFileSync(filePath, 'utf8');
                    return [2 /*return*/, JSON.parse(content)];
                }
            }
            catch (error) {
                console.log(chalk_1.default.yellow("No existing translations found for ".concat(locale)));
            }
            return [2 /*return*/, {}];
        });
    });
}
// Replace your translateJson function with this simplified version
function translateJson(sourceLanguage, targetLanguage, forceUpdate) {
    if (forceUpdate === void 0) { forceUpdate = false; }
    return __awaiter(this, void 0, void 0, function () {
        // Process all keys recursively
        function processEntries(source, existing, currentPath) {
            if (currentPath === void 0) { currentPath = ''; }
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, _i, key, fullPath, sourceValue, existingEntry;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = source;
                            _b = [];
                            for (_c in _a)
                                _b.push(_c);
                            _i = 0;
                            _d.label = 1;
                        case 1:
                            if (!(_i < _b.length)) return [3 /*break*/, 5];
                            _c = _b[_i];
                            if (!(_c in _a)) return [3 /*break*/, 4];
                            key = _c;
                            fullPath = currentPath ? "".concat(currentPath, ".").concat(key) : key;
                            sourceValue = source[key];
                            if (!isTranslationObject(sourceValue)) return [3 /*break*/, 3];
                            if (!isTranslationObject(existing[key])) {
                                // Initialize as empty object if it's not an object
                                existing[key] = {};
                            }
                            return [4 /*yield*/, processEntries(sourceValue, existing[key], fullPath)];
                        case 2:
                            _d.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            existingEntry = existing[key];
                            if (!existingEntry || forceUpdate) {
                                if (!existingEntry) {
                                    newCount++;
                                    console.log(chalk_1.default.green("+ New: ".concat(fullPath)));
                                }
                                else {
                                    updatedCount++;
                                    console.log(chalk_1.default.magenta("\u21BB Force updated: ".concat(fullPath)));
                                }
                                setNestedValue(pendingTranslations, fullPath.split('.'), sourceValue);
                                return [3 /*break*/, 4];
                            }
                            if (isTranslationEntry(existingEntry)) {
                                if (!areValuesEqual(existingEntry.sourceMessage, sourceValue)) {
                                    updatedCount++;
                                    console.log(chalk_1.default.yellow("\u21BB Updated (source changed): ".concat(fullPath)));
                                    setNestedValue(pendingTranslations, fullPath.split('.'), sourceValue);
                                }
                                else {
                                    unchangedCount++;
                                }
                                return [3 /*break*/, 4];
                            }
                            updatedCount++;
                            console.log(chalk_1.default.blue("\uD83D\uDCDD Added source tracking: ".concat(fullPath)));
                            setNestedValue(pendingTranslations, fullPath.split('.'), sourceValue);
                            _d.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        var sourcePath, sourceJson, existingTranslations, newCount, updatedCount, unchangedCount, pendingTranslations, startTime, pendingString, response, translatedContent, jsonContent, translatedValues, preFilePath, translationTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n".concat('-'.repeat(50), "\n").concat(chalk_1.default.blue("Processing ".concat(targetLanguage.toUpperCase(), " translations")), "\n").concat('-'.repeat(50)));
                    sourcePath = path_1.default.join(__dirname, '..', 'messages', "".concat(sourceLanguage, ".json"));
                    sourceJson = JSON.parse(fs_1.default.readFileSync(sourcePath, 'utf8'));
                    return [4 /*yield*/, getExistingTranslations(targetLanguage)];
                case 1:
                    existingTranslations = _a.sent();
                    newCount = 0;
                    updatedCount = 0;
                    unchangedCount = 0;
                    pendingTranslations = {};
                    return [4 /*yield*/, processEntries(sourceJson, existingTranslations)];
                case 2:
                    _a.sent();
                    if (Object.keys(pendingTranslations).length === 0) {
                        console.log(chalk_1.default.green('✅ No changes to translate'));
                        compileCleanTranslation(existingTranslations, targetLanguage);
                        console.log("\n".concat('-'.repeat(50), "\n").concat(chalk_1.default.blue("Summary for ".concat(targetLanguage.toUpperCase())), "\n").concat('-'.repeat(50)));
                        console.log(chalk_1.default.blue("\u2022 New translations: ".concat(newCount)));
                        console.log(chalk_1.default.blue("\u2022 Updated translations: ".concat(updatedCount)));
                        console.log(chalk_1.default.blue("\u2022 Unchanged translations: ".concat(unchangedCount)));
                        console.log("".concat('-'.repeat(50), "\n"));
                        return [2 /*return*/];
                    }
                    console.log(chalk_1.default.blue("\n\uD83D\uDD04 Translating to ".concat(targetLanguage, "...")));
                    startTime = Date.now();
                    pendingString = JSON.stringify(pendingTranslations, null, 2);
                    return [4 /*yield*/, openai.chat.completions.create({
                            model: 'gpt-4o-mini',
                            messages: [
                                {
                                    role: 'system',
                                    content: "You are a professional translator. Translate the following JSON content from ".concat(sourceLanguage, " to ").concat(targetLanguage, ". \n        Preserve all JSON structure, keys, and formatting. Only translate the string values."),
                                },
                                {
                                    role: 'user',
                                    content: "Translate ONLY these JSON parts to ".concat(targetLanguage, ":\n").concat(pendingString),
                                },
                            ],
                            temperature: 0.3,
                        })];
                case 3:
                    response = _a.sent();
                    translatedContent = response.choices[0].message.content || '';
                    jsonContent = extractJsonFromResponse(translatedContent);
                    try {
                        translatedValues = JSON.parse(jsonContent);
                        mergeTranslations(translatedValues, pendingTranslations, existingTranslations);
                        preFilePath = path_1.default.join(PRE_FOLDER, "".concat(targetLanguage, ".json"));
                        fs_1.default.writeFileSync(preFilePath, JSON.stringify(existingTranslations, null, 2));
                        compileCleanTranslation(existingTranslations, targetLanguage);
                        translationTime = ((Date.now() - startTime) / 1000).toFixed(2);
                        console.log(chalk_1.default.green("\u2705 Translation completed in ".concat(translationTime, "s")));
                        console.log("\n".concat('-'.repeat(50), "\n").concat(chalk_1.default.blue("Summary for ".concat(targetLanguage.toUpperCase())), "\n").concat('-'.repeat(50)));
                        console.log(chalk_1.default.blue("\u2022 New translations: ".concat(newCount)));
                        console.log(chalk_1.default.blue("\u2022 Updated translations: ".concat(updatedCount)));
                        console.log(chalk_1.default.blue("\u2022 Unchanged translations: ".concat(unchangedCount)));
                        console.log(chalk_1.default.blue("\u2022 Translation time: ".concat(translationTime, "s")));
                        console.log("".concat('-'.repeat(50), "\n"));
                    }
                    catch (error) {
                        console.error(chalk_1.default.red('Error processing translation:'), error);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Helper to set a value in a nested object structure
function setNestedValue(obj, path, value) {
    var key = path[0];
    if (path.length === 1) {
        obj[key] = value;
        return;
    }
    if (!obj[key] || typeof obj[key] !== 'object') {
        obj[key] = {};
    }
    setNestedValue(obj[key], path.slice(1), value);
}
// Helper to get a value from a nested object structure
function getNestedValue(obj, path) {
    var current = obj;
    for (var _i = 0, path_2 = path; _i < path_2.length; _i++) {
        var key = path_2[_i];
        if (current &&
            typeof current === 'object' &&
            !Array.isArray(current) &&
            key in current) {
            current = current[key];
        }
        else {
            return undefined;
        }
    }
    return current;
}
// Extract JSON from OpenAI response
function extractJsonFromResponse(response) {
    try {
        // First check if the entire response is valid JSON
        JSON.parse(response);
        return response;
    }
    catch (e) {
        // Try to extract JSON from markdown code blocks
        if (response.includes('```json')) {
            return response.split('```json')[1].split('```')[0].trim();
        }
        else if (response.includes('```')) {
            return response.split('```')[1].split('```')[0].trim();
        }
        // Last resort: try to find JSON-like content
        var jsonMatch = response.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (jsonMatch)
            return jsonMatch[0];
        return response;
    }
}
// Merge translations with metadata
function mergeTranslations(translated, source, target, path) {
    if (path === void 0) { path = []; }
    for (var key in source) {
        var currentPath = __spreadArray(__spreadArray([], path, true), [key], false);
        var sourceValue = source[key];
        var translatedValue = getNestedValue(translated, currentPath);
        if (isTranslationObject(sourceValue) && !('sourceMessage' in sourceValue)) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {};
            }
            mergeTranslations(translated, sourceValue, target[key], currentPath);
        }
        else if (translatedValue !== undefined) {
            // Store as enhanced object with source tracking
            target[key] = {
                defaultMessage: translatedValue,
                sourceMessage: sourceValue,
            };
        }
    }
}
// Compile clean version without metadata
function compileCleanTranslation(withMetadata, locale) {
    function extractMessages(obj) {
        var result = {};
        for (var key in obj) {
            var value = obj[key];
            if (isTranslationObject(value)) {
                if ('defaultMessage' in value) {
                    // It's a translation entry with metadata
                    result[key] = value.defaultMessage;
                }
                else {
                    // It's a nested object
                    result[key] = extractMessages(value);
                }
            }
            else {
                // It's a direct value (array, number, etc)
                result[key] = value;
            }
        }
        return result;
    }
    var cleanJson = extractMessages(withMetadata);
    var finalPath = path_1.default.join(__dirname, '..', 'messages', "".concat(locale, ".json"));
    fs_1.default.writeFileSync(finalPath, JSON.stringify(cleanJson, null, 2));
    console.log(chalk_1.default.green("\u2705 Clean translation file saved to ".concat(finalPath)));
}
function createSourcePreFile(sourceLanguage) {
    console.log(chalk_1.default.blue("Creating pre file for source language (".concat(sourceLanguage, ")...")));
    try {
        // Read source language file
        var sourcePath = path_1.default.join(__dirname, '..', 'messages', "".concat(sourceLanguage, ".json"));
        var sourceJson = JSON.parse(fs_1.default.readFileSync(sourcePath, 'utf8'));
        // Convert to pre format with defaultMessage/sourceMessage structure
        function convertToPre(obj) {
            var result = {};
            for (var key in obj) {
                var value = obj[key];
                if (typeof value === 'string') {
                    // Convert string values to TranslationEntry format
                    result[key] = {
                        defaultMessage: value,
                        sourceMessage: value,
                    };
                }
                else if (Array.isArray(value)) {
                    // Keep arrays as-is
                    result[key] = value;
                }
                else if (isTranslationObject(value)) {
                    // Recursively process nested objects
                    result[key] = convertToPre(value);
                }
                else {
                    // Keep other types (numbers, booleans) as-is
                    result[key] = value;
                }
            }
            return result;
        }
        var preJson = convertToPre(sourceJson);
        // Save to pre folder
        var preFilePath = path_1.default.join(PRE_FOLDER, "".concat(sourceLanguage, ".json"));
        fs_1.default.writeFileSync(preFilePath, JSON.stringify(preJson, null, 2));
        console.log(chalk_1.default.green("\u2705 Source pre file created at ".concat(preFilePath)));
    }
    catch (error) {
        console.error(chalk_1.default.red("Error creating source pre file:"), error);
    }
}
// Main execution code
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, sourceLanguage, targetLanguages, forceUpdate, _i, targetLanguages_1, lang, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv.slice(2);
                    sourceLanguage = args[0] || 'en';
                    targetLanguages = args[1] ? args[1].split(',') : ['fr', 'es', 'pt'];
                    forceUpdate = args.includes('--force');
                    // Create pre directory if it doesn't exist
                    if (!fs_1.default.existsSync(PRE_FOLDER)) {
                        fs_1.default.mkdirSync(PRE_FOLDER, { recursive: true });
                    }
                    // First, create pre file for source language (usually English)
                    createSourcePreFile(sourceLanguage);
                    console.log("No target language provided. Translating from ".concat(sourceLanguage, " to all available languages: ").concat(targetLanguages.join(', ')));
                    _i = 0, targetLanguages_1 = targetLanguages;
                    _a.label = 1;
                case 1:
                    if (!(_i < targetLanguages_1.length)) return [3 /*break*/, 6];
                    lang = targetLanguages_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, translateJson(sourceLanguage, lang, forceUpdate)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(chalk_1.default.red("Error processing ".concat(lang, ":")), error_1);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Run the script
main().catch(function (error) {
    console.error(chalk_1.default.red('Translation process failed:'), error);
    process.exit(1);
});
