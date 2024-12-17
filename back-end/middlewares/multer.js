import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Kiểm tra và tạo thư mục uploads nếu chưa tồn tại
const uploadDirectory = 'uploads/';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);  // Lưu vào thư mục 'uploads/'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Tên file là timestamp + tên gốc
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file tối đa là 5MB
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extname && mimeType) {
      cb(null, true);  // Chấp nhận file
    } else {
      cb(new Error('Chỉ hỗ trợ file ảnh (jpeg, jpg, png)!'));  // Lỗi nếu file không hợp lệ
    }
  },
});
