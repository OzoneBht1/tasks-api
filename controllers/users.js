import { validationResult } from "express-validator";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { selectFields } from "../utils/selectFields.js";
import { generateToken } from "../utils/generateToken.js";

const access = process.env.SECRET;
const refresh = process.env.REFRESH;

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

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const isCorrectPassword = await compare(password, user.password);
      if (isCorrectPassword) {
        const accessToken = generateToken(
          {
            userId: user._id.toString(),
          },
          access,
          {
            expiresIn: "1h",
          }
        );

        const refreshToken = generateToken(
          {
            userId: user._id.toString(),
          },
          refresh,
          {
            expiresIn: "7d",
          }
        );
        return res
          .status(200)
          .json({ access: accessToken, refresh: refreshToken });
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

export const refreshAccess = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    const error = new Error("Invalid fields");
    error.statusCode = 400;
    throw error;
  }
  jwt.verify(token, refresh, (error, payload) => {
    if (error) {
      throw new Error("Balls");
    }
    const accessToken = generateToken({ userId: payload.userId }, access, {
      expiresIn: "1h",
    });
    return res.status(200).json({ access: accessToken });
  });
};
