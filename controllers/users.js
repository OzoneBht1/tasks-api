import { validationResult } from "express-validator";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { selectFields } from "../utils/selectFields.js";

export const postUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error("Validation Failed");
    error.statusCode = 400;
    error.data = selectFields(errors.array());
    next(error);
  }

  const { email, name, password } = req.body;

  try {
    const hashedPassword = await hash(password, 10);
    const user = new User({ email, name, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const isCorrectPassword = await compare(password, user.password);
      if (isCorrectPassword) {
        const token = jwt.sign(
          {
            userId: user._id.toString(),
            iat: Math.floor(Date.now() / 1000) - 30,
          },
          process.env.SECRET
        );
        user.save({ token: token, tokenExpiration: "1h" });
        return res.status(200).json({ token: token });
      }
      const error = new Error("Invalid Email or Password");
      error.statusCode = 401;
      next(error);
    }
    const error = new Error("Invalid Email or Password");
    error.statusCode = 401;
    next(error);
  } catch (err) {
    next(err);
  }
};
