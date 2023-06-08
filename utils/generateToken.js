import jwt from "jsonwebtoken";

export const generateToken = (userDetails, signature, expire) => {
  return jwt.sign(userDetails, signature, expire);
};
