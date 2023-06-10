import { Router } from "express";
import { body } from "express-validator";
import { getTasks, postTask, updateTask } from "../controllers/tasks.js";
import { isAuth } from "../utils/isAuth.js";

const router = Router();

router.get("/tasks", isAuth, getTasks);

router.post(
  "/task",
  [
    body("title", "Title is required").isAlphanumeric().notEmpty(),
    body("description", "Description is required").notEmpty(),
  ],
  isAuth,
  postTask
);

router.put(
  "/tasks/:id",
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("The title should be atleast of length 1"),
    body("description")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("The description should be atleast of length 1"),
  ],
  isAuth,
  updateTask
);

export default router;
