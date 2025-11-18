import jwt from "jsonwebtoken";

export const jwtService = {
 sign:  (data) =>
  jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE }),
 verify:  (token) => jwt.verify(token, process.env.JWT_SECRET)

};