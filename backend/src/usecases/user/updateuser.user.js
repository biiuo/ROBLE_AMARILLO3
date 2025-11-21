import User from "../../models/user.model.js";

const updateUserUseCase = async (identifier, data) => {
  try {
    console.log("🔍 Buscando usuario con identifier:", identifier);
    console.log("📋 Datos a actualizar:", data);

    let user = null;

    // 1️⃣ Si es un número → Buscar por ID
    if (!isNaN(identifier)) {
      user = await User.findOne({ ID: Number(identifier) });
      console.log("Búsqueda por ID:", user ? "Encontrado" : "No encontrado");
    }

    // 2️⃣ Buscar por username si no se encontró por ID
    if (!user) {
      user = await User.findOne({ username: identifier });
      console.log("Búsqueda por username:", user ? "Encontrado" : "No encontrado");
    }

    // 3️⃣ Buscar por email si aún no se encontró
    if (!user) {
      user = await User.findOne({ email: identifier });
      console.log("Búsqueda por email:", user ? "Encontrado" : "No encontrado");
    }

    if (!user) {
      throw new Error("Usuario no encontrado: " + identifier);
    }

    console.log("✅ Usuario encontrado:", user.username);

    // 🔄 Validar campos únicos si se están actualizando
    if (data.username && data.username !== user.username) {
      const existingUsername = await User.findOne({ 
        username: data.username,
        _id: { $ne: user._id }
      });
      if (existingUsername) {
        throw new Error("El nombre de usuario ya está en uso");
      }
    }

    if (data.email && data.email !== user.email) {
      const existingEmail = await User.findOne({ 
        email: data.email,
        _id: { $ne: user._id }
      });
      if (existingEmail) {
        throw new Error("El email ya está registrado");
      }
    }

    // 📝 Actualizar campos
    const allowedFields = ['name', 'lastname', 'username', 'email', 'ID'];
    let hasChanges = false;

    allowedFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== user[field]) {
        user[field] = data[field];
        hasChanges = true;
        console.log(`🔄 Campo ${field} actualizado: ${user[field]} → ${data[field]}`);
      }
    });

    if (!hasChanges) {
      console.log("ℹ️ No hay cambios para actualizar");
      return user;
    }

    // 💾 Guardar cambios
    await user.save();

    // 🚫 Excluir password de la respuesta
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log("✅ Usuario actualizado exitosamente");

    return userResponse;

  } catch (error) {
    console.error("❌ Error en updateUserUseCase:", error.message);
    
    // Manejar errores de MongoDB
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      throw new Error(errors.join(', '));
    }

    if (error.code === 11000) {
      throw new Error("El email o nombre de usuario ya existe");
    }

    throw error;
  }
};

export default updateUserUseCase;