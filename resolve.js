const fs = require('fs');
const path = require('path');
const dir = 'c:\\hawaahawaai';
const files = fs.readdirSync(dir);

for (const file of files) {
  const filePath = path.join(dir, file);
  if (fs.statSync(filePath).isFile()) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('<<<<<<< HEAD')) {
      // Replace the conflict block with only the HEAD content
      const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n[\s\S]*?\r?\n>>>>>>> [^\r\n]+/g;
      const newContent = content.replace(regex, '$1');
      
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Resolved: ${file}`);
      }
    }
  }
}
