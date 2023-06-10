import { selectFields } from "../utils/selectFields.js";
import Task from "../models/task.js";
import { validationResult } from "express-validator";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user });
    res.status(201).json({ tasks: tasks });
  } catch (err) {
    next(err);
  }
};

export const postTask = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error("Validation Error");
    console.log(selectFields(errors.array()));
    error.statusCode = 401;
    error.data = selectFields(errors.array());
    next(error);
  }

  const { title, description } = req.body;
  const userId = req.user;
  try {
    const task = new Task({ title, description, userId });
    await task.save();
    res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Error");
    error.statusCode = 401;
    error.data = selectFields(errors.array());
    next(error);
  }
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      const error = new Error("No Task found for the given id");
      error.statusCode = 403;
      next(err);
    }

    const { title, description } = req.body;

    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    await task.save();
    res.status(201).json({ message: "Updated successfully" });
  } catch (err) {
    next(err);
  }
};
