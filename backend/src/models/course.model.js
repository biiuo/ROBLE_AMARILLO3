import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "El título es requerido"],
    trim: true,
    minlength: [3, "El título debe tener al menos 3 caracteres"]
  },
  description: { 
    type: String, 
    required: [true, "La descripción es requerida"],
    trim: true 
  },
  category: { 
    type: String, 
    enum: [
      "web-development",
      "mobile-development", 
      "data-science",
      "artificial-intelligence",
      "cybersecurity",
      "cloud-computing",
      "devops",
      "programming-fundamentals",
      "database",
      "ui-ux-design",
      "game-development",
      "blockchain"
    ],
    required: [true, "La categoría es requerida"]
  },
  level: { 
    type: String, 
    enum: ["beginner", "intermediate", "advanced"],
    required: [true, "El nivel es requerido"]
  },
  price: { 
    type: Number, 
    default: 0,
    min: [0, "El precio no puede ser negativo"]
  },
  duration: { 
    type: String, 
    required: [true, "La duración es requerida"] 
  },
  image: { 
    type: String,
    default: "" 
  },
  imagePublicId: {
    type: String,
    default: ""
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  lessons: [
    {
      title: { type: String, required: true },
      description: { type: String },
      videoUrl: { type: String },
      duration: { type: String },
      order: { type: Number, default: 0 },
      resources: [
        {
          title: { type: String },
          url: { type: String },
          type: { 
            type: String, 
            enum: ["pdf", "doc", "code", "link", "other"] 
          }
        }
      ]
    }
  ],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  }
}, {
  timestamps: true
});

export default mongoose.model("Course", CourseSchema);