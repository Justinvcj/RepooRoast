import { runStaticAnalysis } from './src/analyzers/staticAnalyzer.js';

const mockFiles = {
  'test.js': `
    function helloWorld(a, b) {
      if (a > b) {
        return a;
      } else {
        // TODO: handle equality
        return b;
      }
    }

    const test = () => {
      let x = 100;
      let y = 500; // magic number
      if (x && y) {
        console.log("hi");
      }
    }
  `
};

async function run() {
  console.log('Running static analysis...');
  const result = await runStaticAnalysis(mockFiles);
  console.log(JSON.stringify(result, null, 2));
}

run();
