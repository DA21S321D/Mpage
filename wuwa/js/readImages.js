const fs = require('fs');
const path = require('path');

try {
  // 读取文件内容
  const data = fs.readFileSync(path.join(__dirname, 'pic', 'output.txt'), 'utf8');

  // 将文件内容按行分割
  const lines = data.split('\n');

  // 处理每一行，生成图片数组
  const images = lines
    .map(line => line.trim()) // 去除首尾空格
    .filter(line => line.length > 0) // 过滤空行
    .map(line => {
      // 去除行尾的逗号
      line = line.replace(/,$/, '');
      // 去除单引号
      line = line.replace(/^'/, '').replace(/'$/, '');
      // 如果需要移除 'pic/' 前缀，可以取消下一行的注释
      // line = line.replace(/^pic\//, '');
      return line;
    });

  // 将 images 数组输出为变量赋值的形式
  console.log('const images = [');
  images.forEach(image => {
    console.log(`    '${image}',`);
  });
  console.log('];');
} catch (err) {
  console.error('读取文件时发生错误：', err.message);
}
