import bcrypt from "bcryptjs";

export const hashService = {
  hash: (password) => bcrypt.hash(password, 10),
  compare: (pass, hash) => bcrypt.compare(pass, hash)
};
