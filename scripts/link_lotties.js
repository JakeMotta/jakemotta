const fs = require('fs');
const path = require('path');

const lottiesDir = path.resolve(__dirname, '../src/assets/lotties');
const outputFile = path.resolve(__dirname, '../src/assets/lotties/index.ts');

// Function to convert a string to PascalCase
function toPascalCase(str) {
  return str
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(new RegExp(/\s+(.)(\w+)/, 'g'), (_, p1, p2) => p1.toUpperCase() + p2.toLowerCase())
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}

fs.readdir(lottiesDir, (err, files) => {
  if (err) {
    console.error('Error reading lotties directory:', err);
    return;
  }

  const imports = files
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const variableName = toPascalCase(path.basename(file, '.json'));
      return `import * as ${variableName} from './${file}';`;
    })
    .join('\n');

  const exports = files
    .filter((file) => file.endsWith('.json'))
    .map((file) => toPascalCase(path.basename(file, '.json')))
    .join(', ');

  const content = `${imports}\n\nexport { ${exports} };`;

  fs.writeFile(outputFile, content, (err) => {
    if (err) {
      console.error('Error writing index.ts:', err);
      return;
    }
    console.log('index.ts generated successfully.');
  });
});
