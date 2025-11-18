import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String },
  transactionId: { type: String },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  purchasedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
