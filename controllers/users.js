import { validationResult } from "express-validator";
import { hash } from "bcrypt";
import User from "../models/user.js";

export const postUser = async (req, res) => {
  const { email, name, password } = req.body;
  console.log(email, name, password);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ detail: errors.errors[0].msg });
  }

  try {
    const hashedPassword = await hash(password, 10);
    const user = new User({ email, name, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
  }
};
