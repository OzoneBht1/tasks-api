import { Router } from "express";
import { check } from "express-validator";
import { getTasks, postTask } from "../controllers/tasks.js";

const router = Router();

router.get("/", getTasks);

router.post(
  "/",
  [check("title", "Title is required").isAlphanumeric().notEmpty()],
  postTask
);

export default router;
