// controllers/uploadController.js
import { uploadToCloudinary, deleteFromCloudinary} from '../services/upload.service.js';
import{upload} from '../services/upload.service.js';
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
    }

    // Subir a Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'courses');

    res.json({
      success: true,
      message: 'Imagen subida exitosamente a Cloudinary',
      data: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height
      }
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir la imagen',
      error: error.message
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'ID público de la imagen requerido'
      });
    }

    const result = await deleteFromCloudinary(publicId);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Imagen eliminada exitosamente de Cloudinary'
      });
    } else {
      throw new Error('No se pudo eliminar la imagen de Cloudinary');
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la imagen',
      error: error.message
    });
  }
};

// Exportar middleware de multer
export { upload };