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
  jwt.verify(token, process.env.SECRET, (error, payload) => {
    if (error) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }
    req.user = payload.userId;
    next();
  });
};
