const API_URL = import.meta.env.VITE_API_URL;

// Helper para hacer requests con auth
const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: data.message || `Error ${response.status}: ${response.statusText}`,
        status: response.status
      };
    }

    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error.message || 'Error de conexión con el servidor'
    };
  }
};

/* ===============================
        📚 COURSES API
     =============================== */

/**
 * Obtener todos los cursos (públicos)
 */
export async function apiGetCourses(filters = {}) {
  const queryParams = new URLSearchParams();
  
  // Agregar filtros si existen
  if (filters.category) queryParams.append('category', filters.category);
  if (filters.level) queryParams.append('level', filters.level);
  if (filters.isPublished !== undefined) queryParams.append('isPublished', filters.isPublished);
  
  const queryString = queryParams.toString();
  const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;
  
  return authFetch(endpoint);
}

/**
 * Obtener cursos del usuario logueado
 */
export async function apiGetUserCourses() {
  return authFetch('/courses/my-courses');
}

/**
 * Obtener un curso específico por ID
 */
export async function apiGetCourse(courseId) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }
  return authFetch(`/courses/${courseId}`);
}

/**
 * Crear un nuevo curso (solo admin/instructores)
 */
export async function apiCreateCourse(courseData) {
  if (!courseData.title || !courseData.description) {
    return { ok: false, error: 'Título y descripción son requeridos' };
  }

  return authFetch('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData)
  });
}

/**
 * Actualizar un curso existente
 */
export async function apiUpdateCourse(courseId, courseData) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  return authFetch(`/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData)
  });
}

/**
 * Eliminar un curso
 */
export async function apiDeleteCourse(courseId) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  return authFetch(`/courses/${courseId}`, {
    method: 'DELETE'
  });
}

/**
 * Inscribirse a un curso
 */
export async function apiEnrollCourse(courseId) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  return authFetch(`/courses/${courseId}/enroll`, {
    method: 'POST'
  });
}

/**
 * Salir de un curso (desinscribirse)
 */
export async function apiUnenrollCourse(courseId) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  return authFetch(`/courses/${courseId}/unenroll`, {
    method: 'POST'
  });
}

/**
 * Obtener estudiantes de un curso (solo admin/instructor del curso)
 */
export async function apiGetCourseStudents(courseId) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  return authFetch(`/courses/${courseId}/students`);
}

/**
 * Actualizar progreso de un curso
 */
export async function apiUpdateCourseProgress(courseId, progressData) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  if (progressData.progress === undefined || progressData.lessonId === undefined) {
    return { ok: false, error: 'Progreso y ID de lección son requeridos' };
  }

  return authFetch(`/courses/${courseId}/progress`, {
    method: 'PUT',
    body: JSON.stringify(progressData)
  });
}

/**
 * Obtener cursos por categoría
 */
export async function apiGetCoursesByCategory(category) {
  if (!category) {
    return { ok: false, error: 'Categoría es requerida' };
  }

  return authFetch(`/courses/category/${category}`);
}

/**
 * Buscar cursos
 */
export async function apiSearchCourses(query, filters = {}) {
  const queryParams = new URLSearchParams({ q: query });
  
  // Agregar filtros adicionales
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });
  
  return authFetch(`/courses/search?${queryParams.toString()}`);
}

/**
 * Obtener cursos populares (más estudiantes)
 */
export async function apiGetPopularCourses(limit = 10) {
  return authFetch(`/courses/popular?limit=${limit}`);
}

/**
 * Obtener cursos recientemente agregados
 */
export async function apiGetRecentCourses(limit = 10) {
  return authFetch(`/courses/recent?limit=${limit}`);
}

/**
 * Agregar lección a un curso (solo admin/instructor)
 */
export async function apiAddLessonToCourse(courseId, lessonData) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  if (!lessonData.title || !lessonData.content) {
    return { ok: false, error: 'Título y contenido de la lección son requeridos' };
  }

  return authFetch(`/courses/${courseId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(lessonData)
  });
}

/**
 * Actualizar lección de un curso
 */
export async function apiUpdateLesson(courseId, lessonId, lessonData) {
  if (!courseId || !lessonId) {
    return { ok: false, error: 'ID del curso y lección son requeridos' };
  }

  return authFetch(`/courses/${courseId}/lessons/${lessonId}`, {
    method: 'PUT',
    body: JSON.stringify(lessonData)
  });
}

/**
 * Eliminar lección de un curso
 */
export async function apiDeleteLesson(courseId, lessonId) {
  if (!courseId || !lessonId) {
    return { ok: false, error: 'ID del curso y lección son requeridos' };
  }

  return authFetch(`/courses/${courseId}/lessons/${lessonId}`, {
    method: 'DELETE'
  });
}

/**
 * Obtener estadísticas de cursos (solo admin)
 */
export async function apiGetCourseStats() {
  return authFetch('/courses/stats');
}

/**
 * Subir imagen del curso
 */
export async function apiUploadCourseImage(courseId, imageFile) {
  if (!courseId || !imageFile) {
    return { ok: false, error: 'ID del curso y archivo de imagen son requeridos' };
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: data.message || `Error ${response.status}: ${response.statusText}`
      };
    }

    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error.message || 'Error de conexión con el servidor'
    };
  }
}

/**
 * Obtener cursos recomendados para el usuario
 */
export async function apiGetRecommendedCourses(limit = 6) {
  return authFetch(`/courses/recommended?limit=${limit}`);
}

/**
 * Marcar curso como completado
 */
export async function apiCompleteCourse(courseId) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  return authFetch(`/courses/${courseId}/complete`, {
    method: 'POST'
  });
}

/**
 * Obtener certificado del curso
 */
export async function apiGetCourseCertificate(courseId) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  return authFetch(`/courses/${courseId}/certificate`);
}

/**
 * Calificar un curso
 */
export async function apiRateCourse(courseId, rating) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  if (rating === undefined || rating < 1 || rating > 5) {
    return { ok: false, error: 'Rating debe ser entre 1 y 5' };
  }

  return authFetch(`/courses/${courseId}/rate`, {
    method: 'POST',
    body: JSON.stringify({ rating })
  });
}

/**
 * Agregar comentario a un curso
 */
export async function apiAddCourseComment(courseId, comment) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  if (!comment || !comment.trim()) {
    return { ok: false, error: 'El comentario no puede estar vacío' };
  }

  return authFetch(`/courses/${courseId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ comment: comment.trim() })
  });
}

/**
 * Obtener comentarios de un curso
 */
export async function apiGetCourseComments(courseId, page = 1, limit = 10) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  return authFetch(`/courses/${courseId}/comments?page=${page}&limit=${limit}`);
}

/* ===============================
        🎯 COURSE CATEGORIES
     =============================== */

/**
 * Obtener todas las categorías
 */
export async function apiGetCategories() {
  return authFetch('/categories');
}

/**
 * Crear nueva categoría (solo admin)
 */
export async function apiCreateCategory(categoryData) {
  if (!categoryData.name) {
    return { ok: false, error: 'Nombre de categoría es requerido' };
  }

  return authFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  });
}

/* ===============================
        📊 COURSE ANALYTICS
     =============================== */

/**
 * Obtener analytics de un curso (solo admin/instructor)
 */
export async function apiGetCourseAnalytics(courseId) {
  if (!courseId) {
    return { ok: false, error: 'ID del curso es requerido' };
  }

  return authFetch(`/courses/${courseId}/analytics`);
}

/**
 * Obtener analytics generales (solo admin)
 */
export async function apiGetGeneralAnalytics() {
  return authFetch('/analytics/courses');
}

export default {
  // Cursos principales
  apiGetCourses,
  apiGetUserCourses,
  apiGetCourse,
  apiCreateCourse,
  apiUpdateCourse,
  apiDeleteCourse,
  apiEnrollCourse,
  apiUnenrollCourse,
  
  // Búsqueda y filtros
  apiGetCoursesByCategory,
  apiSearchCourses,
  apiGetPopularCourses,
  apiGetRecentCourses,
  apiGetRecommendedCourses,
  
  // Lecciones
  apiAddLessonToCourse,
  apiUpdateLesson,
  apiDeleteLesson,
  
  // Progreso y certificados
  apiUpdateCourseProgress,
  apiCompleteCourse,
  apiGetCourseCertificate,
  
  // Rating y comentarios
  apiRateCourse,
  apiAddCourseComment,
  apiGetCourseComments,
  
  // Estudiantes
  apiGetCourseStudents,
  
  // Categorías
  apiGetCategories,
  apiCreateCategory,
  
  // Analytics
  apiGetCourseAnalytics,
  apiGetGeneralAnalytics,
  apiGetCourseStats,
  
  // Utilidades
  apiUploadCourseImage
};