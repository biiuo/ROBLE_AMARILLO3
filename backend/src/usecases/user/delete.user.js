import User from "../../models/user.model.js";

const deleteUser = async (identifier) => {
  try {
    // Buscar usuario por ID, email o username

    if (!identifier) {
      throw new Error('Se requiere un identificador para eliminar el usuario');
    }

    let user = null;

    // Si identifier es numérico, buscar por campo ID primero
    if (!isNaN(identifier)) {
      user = await User.findOne({ ID: Number(identifier) });
    }

    // Si no se encontró por ID, buscar por email o username
    if (!user) {
      user = await User.findOne({
        $or: [
          { email: identifier },
          { username: identifier }
        ]
      });
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Eliminar el usuario encontrado
    await User.findByIdAndDelete(user._id);
    
    return { 
      success: true, 
      message: 'Usuario eliminado correctamente',
      deletedUser: {
        id: user._id,
        ID: user.ID,
        username: user.username,
        name: user.name,
        email: user.email
      }
    };
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    throw new Error(`Error al eliminar usuario: ${error.message}`);
  }
};

export { deleteUser };