import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: {
    type: String,
    enum: ["user", "admin", "profesor"],
    default: "user"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);