import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  if (req.user) {
    next();
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    const error = new Error(
      "You do not have permission to perform this action."
    );
    error.statusCode = 403;
    throw error;
  }
  const data = jwt.decode(token);

  // if (token.iat > new Date.now()) {
  //   const error = new Error("Token expired. Please log in again");
  //   error.statusCode = 403;
  // }
  req.user = data.userId;
  next();
};
