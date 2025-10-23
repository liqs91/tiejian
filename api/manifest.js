const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // 设置正确的 Content-Type
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  
  // 读取 manifest.json 文件
  const manifestPath = path.join(__dirname, '..', 'pitch', 'manifest.json');
  
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    res.status(200).send(manifestContent);
  } catch (error) {
    console.error('Error reading manifest.json:', error);
    res.status(500).json({ error: 'Failed to read manifest.json' });
  }
};
