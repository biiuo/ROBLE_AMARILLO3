// usecases/course/updatecourse.course.js
import Course from "../../models/course.model.js";
import { deleteFromCloudinary } from "../../services/upload.service.js";

export const updateCourse = async (courseId, updateData, user) => {
  const course = await Course.findById(courseId);
  
  if (!course) {
    throw new Error('Curso no encontrado');
  }

  // Verificar permisos (admin o el creador del curso)
  if (user.role !== 'admin' && course.createdBy.toString() !== user._id.toString()) {
    throw new Error('No tienes permisos para editar este curso');
  }

  // Guardar la imagen anterior para posible eliminación
  const oldImagePublicId = course.imagePublicId;

  // Si se está subiendo una nueva imagen y había una anterior, eliminarla
  if (updateData.imagePublicId && oldImagePublicId && oldImagePublicId !== updateData.imagePublicId) {
    await deleteFromCloudinary(oldImagePublicId);
  }

  // Actualizar el curso
  Object.assign(course, updateData);
  await course.save();

  await course.populate('createdBy', 'name username email');

  return {
    success: true,
    course
  };
};