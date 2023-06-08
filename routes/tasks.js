import { Router } from "express";
import { check } from "express-validator";
import { getTasks, postTask } from "../controllers/tasks.js";
import { isAuth } from "../utils/isAuth.js";

const router = Router();

router.get("/", getTasks);

router.post(
  "/task",
  [check("title", "Title is required").isAlphanumeric().notEmpty()],
  isAuth,
  postTask
);

export default router;
