const fs = require('fs');
const path = require('path');

function removeComments(content) {
  let result = '';
  let i = 0;
  let inSingleLineComment = false;
  let inMultiLineComment = false;
  let inString = false;
  let stringChar = '';
  let inJSXComment = false;
  
  while (i < content.length) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (!inString && !inSingleLineComment && !inMultiLineComment && !inJSXComment) {
      if ((char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
        result += char;
      } else if (char === '{' && nextChar === '/' && content[i + 2] === '*') {
        inJSXComment = true;
        i += 2;
      } else if (char === '/' && nextChar === '/') {
        inSingleLineComment = true;
        i++;
      } else if (char === '/' && nextChar === '*') {
        inMultiLineComment = true;
        i++;
      } else {
        result += char;
      }
    } else if (inString) {
      result += char;
      if (char === stringChar && content[i - 1] !== '\\') {
        inString = false;
        stringChar = '';
      }
    } else if (inJSXComment) {
      if (char === '*' && nextChar === '/' && content[i + 2] === '}') {
        inJSXComment = false;
        i += 2;
      }
    } else if (inSingleLineComment) {
      if (char === '\n') {
        inSingleLineComment = false;
        result += char;
      }
    } else if (inMultiLineComment) {
      if (char === '*' && nextChar === '/') {
        inMultiLineComment = false;
        i++;
      }
    }
    
    i++;
  }
  
  return result
    .split('\n')
    .map(line => line.trimRight())
    .filter((line, index, array) => {
      if (line.trim() === '') {
        const nextLine = array[index + 1];
        const prevLine = array[index - 1];
        return !(nextLine && nextLine.trim() === '' || 
                 prevLine && prevLine.trim() === '');
      }
      return true;
    })
    .join('\n');
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const cleanContent = removeComments(content);
  fs.writeFileSync(filePath, cleanContent);
  console.log(`Cleaned: ${filePath}`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !['node_modules', '.git', 'dist', 'dev-dist'].includes(file)) {
      walkDir(filePath);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx')) && 
               !file.includes('remove-comments') && 
               !filePath.includes('node_modules') && 
               !filePath.includes('dist')) {
      processFile(filePath);
    }
  }
}

walkDir('./src');
console.log('All comments removed from src/ directory!'); 