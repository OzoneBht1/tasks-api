import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import UserRoutes from "./routes/users.js";
import TaskRoutes from "./routes/tasks.js";

const app = express();

app.use(express.json());

app.use("/api/users", UserRoutes);
app.use("/api/tasks", TaskRoutes);

app.use("/api", () => {
  console.log("Server");
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message =
    err.message || "Something went wrong with the server. Try again later";
  const data = err.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    console.log("Database Connected Successfully");

    app.listen(3000, () => {
      console.log("Connected to DB and listening on port 3000");
    });
  })
  .catch((err) => console.log(err));
