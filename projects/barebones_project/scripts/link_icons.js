const fs = require('fs');
const path = require('path');

const svgFolder = path.resolve(__dirname, '../src/assets/svgs');
const iconsOutput = path.resolve(__dirname, '../src/assets/svgs/icons.ts');
const typesOutput = path.resolve(__dirname, '../src/utils/types.ts');

fs.readdir(svgFolder, (err, files) => {
  if (err) {
    return console.error('Could not list the directory.', err);
  }

  const imports = [];
  const exports = [];
  const types = [];

  files.forEach((file) => {
    if (path.extname(file) === '.svg') {
      const name = path.basename(file, '.svg');
      const variableName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      imports.push(`import { ReactComponent as ${variableName} } from './${file}';`);
      exports.push(variableName);
      types.push(`"${name}"`);
    }
  });

  const iconsOutputContent = `${imports.join('\n')}
const icons = {
  ${exports.join(',\n  ')}
};
  
export default icons;
  `;

  const newIconType = `// Automatically generated IconType
export type IconType = ${types.join(' | ')};\n`;

  // Read and modify content of types.ts
  let typesContent = fs.readFileSync(typesOutput, 'utf8');

  const iconTypeRegex = /\/\/ Automatically generated IconType[\s\S]+?IconType = [^\n]+;\n/;
  if (iconTypeRegex.test(typesContent)) {
    typesContent = typesContent.replace(iconTypeRegex, '');
  }

  // Append the new IconType to the typesContent
  typesContent += newIconType;

  fs.writeFileSync(iconsOutput, iconsOutputContent, 'utf8');
  fs.writeFileSync(typesOutput, typesContent, 'utf8');
});
