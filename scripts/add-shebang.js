const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'dist', 'index.js');

// 读取编译后的 JS 文件
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    process.exit(1);
  }

  // 添加 shebang 行
  const modifiedData = '#!/usr/bin/env node\n' + data;

  // 写回文件
  fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      process.exit(1);
    }
    console.log('Added shebang to index.js');
  });
});