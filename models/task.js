import { Schema, model } from "mongoose";

const TaskSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: string,
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Task", TaskSchema);
