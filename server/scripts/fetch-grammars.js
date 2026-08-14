import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GRAMMAR_DIR = path.resolve(__dirname, '../grammars');
const SOURCE_DIR = path.resolve(__dirname, '../node_modules/tree-sitter-wasms/out');

const LANGS = ['javascript', 'typescript', 'tsx', 'python'];

async function main() {
  try {
    await fs.mkdir(GRAMMAR_DIR, { recursive: true });
    
    for (const lang of LANGS) {
      const fileName = `tree-sitter-${lang}.wasm`;
      const sourceFile = path.join(SOURCE_DIR, fileName);
      const destFile = path.join(GRAMMAR_DIR, fileName);
      
      console.log(`Copying ${fileName}...`);
      await fs.copyFile(sourceFile, destFile);
      console.log(`Successfully copied ${fileName}`);
    }
    
    console.log('All grammars copied successfully.');
  } catch (error) {
    console.error('Error copying grammars:', error);
    process.exit(1);
  }
}

main();
