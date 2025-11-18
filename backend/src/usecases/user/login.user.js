import User from "../../models/user.model.js";
import { hashService } from "../../services/hash.service.js";
import { jwtService } from "../../services/jwt.service.js";



export default async ({ identifier, password }) => {
    console.log("Login usecase called with:", { identifier, password });
 if (!identifier || !password) {
    throw new Error("identifier y password son requeridos");
  }

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });
  console.log("User found:", user);
  if (!user) throw new Error("Usuario no encontrado");


  const valid = await hashService.compare(password, user.password);
  if (!valid) throw new Error("Credenciales incorrectas");

  const token = jwtService.sign({
    id: user._id,
    role: user.role,
    email: user.email
  });
  console.log("User logged in:", user);
  return { user, token };
};
