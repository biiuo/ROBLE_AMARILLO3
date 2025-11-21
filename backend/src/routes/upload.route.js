// routes/upload.js
import express from 'express';
import { uploadImage, deleteImage} from '../controllers/upload.controller.js';
import { upload } from '../services/upload.service.js';

const router = express.Router();


router.post('/image', upload.single('image'), uploadImage);

// Eliminar imagen
router.delete('/image', deleteImage);

export default router;