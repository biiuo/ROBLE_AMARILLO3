import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  price: { type: Number, default: 0 },
  duration: { type: String },
  lessons: [
    {
      title: String,
      description: String,
      videoUrl: String,
      duration: String
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Course", CourseSchema);
