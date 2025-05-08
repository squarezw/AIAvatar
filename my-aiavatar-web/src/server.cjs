const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

// 确保目录存在
const uploadDir = path.join(__dirname, '../../shared_data/face2face/temp');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

// 文件上传接口
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('Saving file to:', req.file.path);
  res.json({
    filename: req.file.filename
  });
});

// 静态文件服务
app.use(express.static('dist'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
