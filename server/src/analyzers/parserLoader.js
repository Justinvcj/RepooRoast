import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const TreeSitter = require('web-tree-sitter');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GRAMMAR_DIR = path.resolve(__dirname, '../../grammars');

let initialized = false;

const languageMap = {};

const EXTENSION_TO_LANG = {
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.py': 'python',
};

export const initParser = async () => {
  if (initialized) return;
  await TreeSitter.init();
  initialized = true;
};

export const getLanguageForFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return EXTENSION_TO_LANG[ext] || null;
};

let sharedParser = null;

export const getParser = async (languageName) => {
  await initParser();

  if (!languageMap[languageName]) {
    const wasmPath = path.join(GRAMMAR_DIR, `tree-sitter-${languageName}.wasm`);
    try {
      const fs = require('fs');
      const wasmBuffer = fs.readFileSync(wasmPath);
      languageMap[languageName] = await TreeSitter.Language.load(new Uint8Array(wasmBuffer));
    } catch (err) {
      console.warn(`[Parser] Failed to load grammar for ${languageName}:`, err);
      return null;
    }
  }

  if (!sharedParser) {
    sharedParser = new TreeSitter();
  }
  
  sharedParser.setLanguage(languageMap[languageName]);
  return sharedParser;
};
