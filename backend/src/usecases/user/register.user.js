import User from "../../models/user.model.js";
import { hashService } from "../../services/hash.service.js";

export default async ({ name, lastname, username, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("El correo ya está registrado");
    const usernameExists = await User.findOne({ username });
    if (usernameExists) throw new Error("El nombre de usuario ya está en uso");
  const hashed = await hashService.hash(password);

  const user = new User({
    name,
    username,
    lastname,
    email,
    password: hashed
  });

  await user.save();
  return user;
};
