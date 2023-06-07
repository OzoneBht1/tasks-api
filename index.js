import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import UserRoutes from "./routes/users.js";

const app = express();

app.use(express.json());

app.use(UserRoutes);

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    console.log("Database Connected Successfully");

    app.listen(3000, () => {
      console.log("Connected to DB and listening on port 3000");
    });
  })
  .catch((err) => console.log(err));
