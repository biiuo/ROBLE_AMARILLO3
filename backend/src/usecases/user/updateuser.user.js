import User from "../../models/user.model.js";

const updateUserUseCase = async (identifier, data) => {
  try {
    // Buscar primero
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) {
      throw new Error("Usuario no encontrado: " + identifier);
    }

    // Actualizar solo lo que venga en el body
    if (data.name !== undefined && data.name !== "string" && data.name !== "") user.name = data.name;
    if (data.lastname !== undefined && data.lastname !== "string" && data.lastname !== "") user.lastname = data.lastname;
    if (data.username !== undefined && data.username !== "string" && data.username !== "") user.username = data.username;
    if (data.email !== undefined && data.email !== "string" && data.email !== "") user.email = data.email;

    await user.save();

    return user;

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

export default updateUserUseCase;
