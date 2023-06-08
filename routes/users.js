import { Router } from "express";
import { body } from "express-validator";
import { postUser, login } from "../controllers/users.js";
import User from "../models/user.js";

const router = Router();

router.post(
  "/user",
  [
    body("name")
      .trim()
      .isAlpha()
      .withMessage("Enter a valid name")
      .notEmpty()
      .withMessage("Name is required"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 5 })
      .withMessage("The password must atleast be of length 5"),
    body("confirmPassword").custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("The two passwords do not match");
      }
      return true;
    }),

    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((val, { req }) => {
        return User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(
              "A user already exists with the provided email"
            );
          }
          return true;
        });
      })
      .normalizeEmail(),
  ],

  postUser
);

router.post("/login", login);

export default router;
