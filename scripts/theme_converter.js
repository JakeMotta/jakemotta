const fs = require('fs');
const path = require('path');

/**
 * This script will convert all snippets from `.vscode/` into a single `theme.ts` file
 */

const vscodeDir = path.resolve(__dirname, '../.vscode/');
const outputFile = path.resolve(__dirname, '../src/utils/theme.ts');

const theme = {};

// Read all files in the .vscode directory
fs.readdirSync(vscodeDir).forEach((file) => {
  if (file.endsWith('.code-snippets')) {
    const themeName = file.replace('.code-snippets', '');
    const filePath = path.join(vscodeDir, file);
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    theme[themeName] = {};

    Object.keys(fileContent).forEach((key) => {
      let category = fileContent[key].description.toLowerCase();
      let property = '';

      // Fix for border radius
      if (category === 'Border Radius'.toLowerCase()) {
        category = 'borderRadius';
      }

      // Ignore these, don't add them into the theme
      if (category === 'content' || category === 'inline') {
        return;
      }

      if (category === 'color') {
        // Convert the key to camel case
        property = toCamelCase(fileContent[key].name.toLowerCase());
      } else {
        let propertyWords = fileContent[key].name.toLowerCase().split(' ');
        property = propertyWords.length > 1 ? propertyWords[propertyWords.length - 1] : propertyWords;
      }

      if (!theme[themeName][category]) {
        theme[themeName][category] = {};
      }

      theme[themeName][category][property] = fileContent[key].value;
    });
  }
});

// Converts a strint to camel case
function toCamelCase(text) {
  return text
    .split(' ')
    .map((word, index) => (index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
}

// Create the TypeScript export string
const exportString = `export const theme = ${JSON.stringify(theme, null, 2)};\n`;

// Write the export string to the output file
fs.writeFileSync(outputFile, exportString, 'utf8');

console.log(`Themes exported to ${outputFile}`);
