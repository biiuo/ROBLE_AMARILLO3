// usecases/courses/updateProgress.user.js
import Enrollment from "../../models/enrollment.model.js";

export const updateProgress = async (enrollmentId, progress, userId) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      user: userId
    });

    if (!enrollment) {
      throw new Error("Inscripción no encontrada");
    }

    enrollment.progress = Math.min(100, Math.max(0, progress));
    enrollment.lastAccessed = new Date();
    
    if (enrollment.progress === 100) {
      enrollment.completed = true;
    }

    await enrollment.save();

    return {
      success: true,
      enrollment,
      message: "Progreso actualizado correctamente"
    };
  } catch (error) {
    console.error("Error updating progress:", error);
    throw error;
  }
};