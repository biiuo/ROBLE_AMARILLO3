import User from "../../models/user.model.js";

export const getAllUsers = async (filters = {}) => {
  try {
    const query = {};
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { username: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    if (filters.role) {
      query.role = filters.role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return {
      success: true,
      users
    };
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email },
        { username: userData.username }
      ]
    });

    if (existingUser) {
      return {
        success: false,
        error: "El usuario ya existe con ese email o username"
      };
    }

    const user = new User(userData);
    await user.save();

    // No retornar la contraseña
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      success: true,
      user: userResponse
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    // No permitir actualizar contraseña directamente aquí
    if (userData.password) {
      delete userData.password;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return {
        success: false,
        error: "Usuario no encontrado"
      };
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return {
        success: false,
        error: "Usuario no encontrado"
      };
    }

    return {
      success: true,
      message: "Usuario eliminado correctamente"
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};