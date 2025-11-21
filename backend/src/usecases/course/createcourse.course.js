// usecases/course/createcourse.course.js
import Course from "../../models/course.model.js";



export const createCourse = async (courseData, userId) => {
  try {
    console.log("🟡 [UseCase] Creando curso...", { courseData, userId });
    
    // Validaciones requeridas según tu schema
    const requiredFields = ['title', 'description', 'category', 'duration', 'level'];
    const missingFields = requiredFields.filter(field => !courseData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Campos obligatorios faltantes: ${missingFields.join(', ')}`);
    }

    // Validar longitud mínima del título
    if (courseData.title.length < 3) {
      throw new Error('El título debe tener al menos 3 caracteres');
    }

    // Validar categoría (según tu enum)
    const validCategories = [
      "web-development", "mobile-development", "data-science", 
      "artificial-intelligence", "cybersecurity", "cloud-computing", 
      "devops", "programming-fundamentals", "database", 
      "ui-ux-design", "game-development", "blockchain"
    ];
    
    if (!validCategories.includes(courseData.category)) {
      throw new Error('Categoría no válida');
    }

    // Validar nivel
    const validLevels = ["beginner", "intermediate", "advanced"];
    if (!validLevels.includes(courseData.level)) {
      throw new Error('Nivel no válido');
    }

    // Crear el curso
    const course = new Course({
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      price: courseData.price || 0,
      duration: courseData.duration,
      level: courseData.level,
      isPublished: courseData.isPublished || false,
      image: courseData.image || '',
      imagePublicId: courseData.imagePublicId || '',
      createdBy: userId,
      lessons: courseData.lessons || []
    });

    await course.save();
    
    console.log("✅ [UseCase] Curso creado exitosamente:", course._id);
    
    return {
      success: true,
      message: "Curso creado exitosamente",
      course: course
    };
    
  } catch (error) {
    console.error("❌ [UseCase] Error creando curso:", error);
    return {
      success: false,
      message: error.message || "Error al crear el curso",
      error: error.message
    };
  }
};