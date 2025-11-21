import registerUser from "../usecases/user/register.user.js";
import loginUser from "../usecases/user/login.user.js";
import updateUser from "../usecases/user/updateuser.user.js";
import { deleteUser } from "../usecases/user/delete.user.js";
import { deleteUseradmin } from "../usecases/admin/deleteuser.user.js";

export const userController = {
  register: async (req, res) => {
    try {
      console.log("📍 Entrando a register con body:", req.body);
      const user = await registerUser(req.body);
      console.log("✅ Usuario registrado:", user);
      return res.json({ message: "Usuario registrado", user });
    } catch (error) {
      console.error("❌ Error en register:", error.message);
      return res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      console.log("Login request body:", req.body);
      const data = await loginUser(req.body);
      console.log("Login response data:", data.user);
    
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { identifier } = req.params;
      const updateData = req.body;
      const requestingUser = req.user; // Usuario autenticado del middleware

      console.log("🔄 UPDATE REQUEST:");
      console.log("Identifier:", identifier);
      console.log("Update data:", updateData);
      console.log("Requesting user:", requestingUser.username);

      // 🔒 Verificar que el usuario solo pueda actualizar su propio perfil
      if (requestingUser.username !== identifier && !requestingUser.isAdmin) {
        return res.status(403).json({ 
          success: false,
          error: "No tienes permisos para actualizar este perfil" 
        });
      }

      const updatedUser = await updateUser(identifier, updateData);

      if (!updatedUser) {
        return res.status(404).json({ 
          success: false,
          error: "Usuario no encontrado" 
        });
      }

      return res.status(200).json({ 
        success: true,
        message: "Usuario actualizado correctamente", 
        user: updatedUser 
      });

    } catch (error) {
      console.error("❌ Error en update controller:", error.message);
      return res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

delete: async (req, res) => {
  try {
    const { identifier } = req.params;
    const requestingUser = req.user;

    console.log("🗑️ DELETE REQUEST:");
    console.log("Identifier:", identifier);
    console.log("Requesting user:", requestingUser.username);

    // Verificar permisos
    if (requestingUser.username !== identifier && !requestingUser.isAdmin) {
      return res.status(403).json({ 
        success: false,
        error: "No tienes permisos para eliminar este usuario" 
      });
    }

    const deleted = await deleteUser(identifier);
    
    // ✅ Siempre devolver JSON
    return res.status(200).json({ 
      success: true,
      message: "Usuario eliminado correctamente",
      deleted 
    });

  } catch (error) {
    console.error("❌ Error en delete controller:", error.message);
    
    // ✅ Siempre devolver JSON incluso en errores
    return res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
},
  deleteadmin: async (req, res) => {
    try {
      const { identifier } = req.params;
      const requestingUser = req.user;

      console.log("👑 ADMIN DELETE REQUEST:");
      console.log("Identifier:", identifier);
      console.log("Requesting user:", requestingUser.username);

      // 🔒 Verificar que sea admin
      if (!requestingUser.isAdmin) {
        return res.status(403).json({ 
          success: false,
          error: "Se requieren permisos de administrador" 
        });
      }

      const deleted = await deleteUseradmin(identifier);
      
      return res.json({ 
        success: true,
        message: "Usuario eliminado por administrador", 
        deleted 
      });

    } catch (error) {
      console.error("❌ Error en deleteadmin controller:", error.message);
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};