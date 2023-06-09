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
    verified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },

    token: {
      type: String,
      required: false,
      default: null,
    },
    tokenExpiration: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);
