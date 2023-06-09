import { validationResult } from "express-validator";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { selectFields } from "../utils/selectFields.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import { sendMail } from "../utils/mailer.js";

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
      throw new Error("Refresh Token is Incorrect or expired");
    }
    const accessToken = generateToken({ userId: payload.userId }, access, {
      expiresIn: "1h",
    });
    return res.status(200).json({ access: accessToken });
  });
};

export const postResetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Error");
    error.statusCode = 403;
    error.data = errors.array();
    next(error);
  }

  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }

    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        next(err);
      }
      const token = buffer.toString("hex");
      user.token = token;
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);
      user.tokenExpiration = expirationDate;

      sendMail(
        email,
        "Reset password",
        `
<p>Click the following link to reset your password:<p>
 <h3><a href="http://localhost:3000/reset/${token}">Link</a></h3>
`
      ),
        await user.save();
      res
        .status(200)
        .json({ message: "An Email has been sent with further instructions" });
    });
  } catch (err) {
    next(err);
  }
};

export const validateToken = async (req, res, next) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      const error = new Error("Invalid token");
      error.statusCode = 400;
      next(error);
    }
    const expiry = user.tokenExpiration;
    const current = new Date();

    if (expiry < current) {
      const error = new Error("Token is expired");
      error.status = 422;
      throw error;
    }

    return res.status(200).json({ message: "Valid Token" });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 403;
    next(error);
  }
};

export const postChangePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error("Validation Failed");
    error.statusCode = 400;
    error.data = selectFields(errors.array());
    next(error);
  }

  const { password } = req.body;
  const { token } = req.params;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      const error = new Error("Invalid token");
      error.statusCode = 400;
      next(error);
    }
    console.log("Im here");
    const hashedPassword = await hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password Updated Successfully" });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 403;
    next(error);
  }
};
