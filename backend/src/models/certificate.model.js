const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completionDate: { type: Date, required: true },
  certificateUrl: { type: String },
  hashCode: { type: String } // verificación
});

module.exports = mongoose.model("Certificate", CertificateSchema);
