const fs = require('fs');
const path = require('path');

/**
 * This script will parse all the CSS variables from `public/themes` and create a VSCode snippet for each theme.
 */

const inputDir = path.resolve(__dirname, '../public/themes/'); // Set the input directory
const outputDir = path.resolve(__dirname, '../.vscode/'); // Set the input directory

// Initialize an object to store the key/value pairs
const ignoreList = {
  '--border-radius': true,
  'font-family': true,
  '--font-family': true,
  'color-scheme': true,
};

// Initialize an object to store the key/value pairs
const colorIncludeList = {
  '--background': true,
  '--background-light': true,
  '--background-dark': true,
  '--primary': true,
  '--primary-light': true,
  '--primary-dark': true,
  '--text': true,
  '--text-light': true,
  '--text-dark': true,
  '--text-smart': true,
  '--text-link': true,
  '--text-credit': true,
  '--success': true,
  '--warning': true,
  '--error': true,
  '--reliable-high': true,
  '--reliable-medium': true,
  '--reliable-low': true,
};

// Process each file in the input directory
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    let filename = file.split('.')[0];
    const inputFile = path.join(inputDir, file);
    const outputFile = path.join(outputDir, `${filename}.code-snippets`); // Output file for each theme

    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const lines = data.split('\n');
      let isInRoot = false;
      const result = {};

      for (const line of lines) {
        if (line.includes(':root')) {
          isInRoot = true;
          continue;
        }

        if (isInRoot) {
          if (line.trim().startsWith('--')) {
            const parts = line.split(':');
            if (parts.length === 2) {
              const key = parts[0].trim();
              const value = parts[1].trim().replace(';', '');
              let formattedKey = key.replace(/--/g, '');

              if (!ignoreList[key]) {
                if (formattedKey.includes('-')) {
                  formattedKey = formattedKey
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                }

                if (value.includes('#') || value.includes('rgba') || value.includes('rgb') || value.includes('hsla') || value.includes('white') || value.includes('black')) {
                  if (colorIncludeList[key]) {
                    result[`Color ${formattedKey}`] = {
                      prefix: key,
                      body: key,
                      description: 'Color',
                      value,
                      name: formattedKey,
                    };
                  }
                } else {
                  let words = formattedKey.split(' ');
                  let description = words.slice(0, -1).join(' ');
                  result[`${formattedKey}`] = {
                    prefix: key,
                    body: key,
                    description,
                    value,
                    name: formattedKey,
                  };
                }
              }
            }
          }
        }
      }

      fs.writeFile(outputFile, JSON.stringify(result, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log(`Parsed CSS variables from ${inputFile} and saved to ${outputFile}`);
      });
    });
  });
});
