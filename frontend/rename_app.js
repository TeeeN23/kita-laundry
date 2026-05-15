const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  content = content.replace(/LaundryPro/g, 'KitaLaundry');
  content = content.replace(/laundrypro/g, 'kitalaundry');
  content = content.replace(/Laundry Pro/g, 'Kita Laundry');
  content = content.replace(/laundry pro/g, 'kita laundry');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated: ' + filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

const srcPath = path.join(__dirname, 'src');
console.log('Starting replacement in: ' + srcPath);
walkDir(srcPath);
console.log('Done replacing name.');
