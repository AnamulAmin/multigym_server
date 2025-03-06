import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Helper function to create upload directory if it does not exist
const ensureUploadDirectoryExists = (uploadDirectory) => {
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }
};

const createImageUploadRoute = (uploadDirectory) => {
  const router = express.Router();

  // Ensure the upload directory exists
  ensureUploadDirectoryExists(uploadDirectory);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      const sanitizedFilename = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-z0-9]/gi, '_').toLowerCase();
      cb(null, `${sanitizedFilename}_${Date.now()}${path.extname(file.originalname)}`);
    }
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(`Error: File upload only supports the following filetypes - jpeg, jpg, png`);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
  });

  // Image Upload Route
  router.post('/upload', upload.single('image'), (req, res) => {
    try {
      console.log(`Image upload hit: ${req.file ? req.file.originalname : 'No file uploaded'}`);
      
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
      }
      
      res.status(200).send({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: `${req.protocol}://${req.get('host')}/${uploadDirectory}/${req.file.filename}`
      });
    } catch (error) {
      console.error('Error during file upload:', error.message);
      res.status(500).send({ message: 'Internal server error', error: error.message });
    }
  });

  return router;
};

export default createImageUploadRoute;
