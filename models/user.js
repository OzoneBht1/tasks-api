import { Schema, model } from "mongoose";

const UserSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      min: 6,
      required: true,
    },
    token: {
      type: String,
      required: false,
    },
    tokenExpiration: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);
