import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: null },
    password: { type: String, required: true },
    userPrivateKey: { type: String, default: (Math.random() * 10 ** 21).toString(36) },
    userPublicKey: { type: String, default: (Math.random() * 10 ** 21).toString(36) },
    role: { type: String, default: "user" },
    status: { type: String, default: "allowed" },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export { User };
