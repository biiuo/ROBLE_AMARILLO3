import { jwtService } from "./jwt.service.js";
import User from "../models/user.model.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticación requerido'
      });
    }

    const decoded = jwtService.verify(token);
    console.log("🔑 Token decodificado:", decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    console.log("✅ Usuario autenticado:", user.username);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Error en auth middleware:", error.message);
    return res.status(401).json({
      success: false,
      error: 'Token de autenticación inválido'
    });
  }
};

const adminAuth = async (req, res, next) => {
   console.log(req.user)
    try {
  
    await auth(req, res, () => {
    if (req.user.role != 'admin'  && req.user.role != 'profesor') {
        return res.status(403).json({
          success: false,
          error: 'Se requieren permisos de administrador'
        });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

export { auth, adminAuth };