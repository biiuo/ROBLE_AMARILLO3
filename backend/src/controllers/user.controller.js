import registerUser from "../usecases/user/register.user.js";
import loginUser from "../usecases/user/login.user.js";
import updateUser from "../usecases/user/updateuser.user.js";
import deleteUser from "../usecases/user/delete.user.js";

 export const userController = {
  register: async (req, res) => {
    try {
      const user = await registerUser(req.body);
      res.json({ message: "Usuario registrado", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
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
      const identifier = req.params.identifier;
      const { name, lastname, username, email } = req.body;
       if (!identifier) {
      return res.status(400).json({ message: "Falta el parámetro identifier" });
    }

    const updatedUser = await updateUser(identifier, {
      name,
      lastname,
      username,
      email,
    
    });
    
      if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
      return res.status(200).json({ message: "Usuario actualizado", updatedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
      res.status(500).json({ message: "Error del servidor" });
      console.log("REQ PARAMS:", req.params);
    console.log("REQ BODY:", req.body);
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await deleteUser(req.params.id);
      res.json({ message: "Usuario eliminado", deleted });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

