import { getDashboardStats,getUserEnrollmentsWithPayments } from "../usecases/admin/getDasboardStats.usecase.js";
import {  getUserEnrollments, getEnrollmentStats } from "../usecases/admin/getuserenrollment.usecase.js";
import { getAllUsers, createUser, updateUser, deleteUser } from "../usecases/admin/userManagment.usecase.js";
import { getCourseEnrollments } from "../usecases/admin/enrollmentManagment.usecase.js";

// 📊 Obtener estadísticas del dashboard
export const getDashboardStatsController = async (req, res) => {
  try {
    console.log("🟡 [Controller] Iniciando getDashboardStatsController...");
    
    const result = await getDashboardStats();
    
    if (!result.success) {
      console.log("🔴 [Controller] Error en use case:", result.message);
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    console.log("🟢 [Controller] Dashboard stats obtenidas exitosamente");
    res.status(200).json({
      success: true,
      stats: result.stats
    });
  } catch (error) {
    console.error("❌ [Controller] Error crítico en getDashboardStatsController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor en el controlador",
      error: error.message
    });
  }
};

// 👥 Obtener todos los usuarios con sus inscripciones y pagos (ADMIN)
export const getUserEnrollmentsWithPaymentsController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    console.log("🟡 [Controller] Obteniendo usuarios con inscripciones...", { page, limit, search });

    const result = await getUserEnrollmentsWithPayments({ 
      page: parseInt(page), 
      limit: parseInt(limit), 
      search 
    });
    
    if (!result.success) {
      console.log("🔴 [Controller] Error en use case:", result.message);
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    console.log("🟢 [Controller] Usuarios con inscripciones obtenidos exitosamente");
    res.status(200).json({
      success: true,
      users: result.users,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalUsers: result.totalUsers,
      totalEnrollments: result.totalEnrollments,
      totalRevenue: result.totalRevenue
    });
  } catch (error) {
    console.error("❌ [Controller] Error en getUserEnrollmentsWithPaymentsController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// 👤 Obtener inscripciones de un usuario específico
export const getUserEnrollmentsController = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    console.log("🟡 [Controller] Obteniendo inscripciones para usuario:", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario no proporcionado"
      });
    }

    const result = await getUserEnrollments(userId);
    
    if (!result.success) {
      console.log("🔴 [Controller] Error en use case:", result.message);
      return res.status(404).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    console.log("🟢 [Controller] Inscripciones del usuario obtenidas exitosamente");
    res.status(200).json({
      success: true,
      user: result.user
    });
  } catch (error) {
    console.error("❌ [Controller] Error en getUserEnrollmentsController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// 📈 Obtener estadísticas de inscripciones
export const getEnrollmentStatsController = async (req, res) => {
  try {
    const { timeRange = 'month' } = req.query;
    console.log("🟡 [Controller] Obteniendo estadísticas de inscripciones...", { timeRange });

    const result = await getEnrollmentStats(timeRange);
    
    if (!result.success) {
      console.log("🔴 [Controller] Error en use case:", result.message);
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    console.log("🟢 [Controller] Estadísticas de inscripciones obtenidas exitosamente");
    res.status(200).json({
      success: true,
      stats: result.stats
    });
  } catch (error) {
    console.error("❌ [Controller] Error en getEnrollmentStatsController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// 📋 Obtener todos los usuarios (para gestión de usuarios)
export const getAllUsersController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    console.log("🟡 [Controller] Obteniendo lista de usuarios...", { page, limit, search });

    const result = await getAllUsers({ 
      page: parseInt(page), 
      limit: parseInt(limit), 
      search 
    });
    
    if (!result.success) {
      console.log("🔴 [Controller] Error en use case:", result.message);
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    console.log("🟢 [Controller] Lista de usuarios obtenida exitosamente");
    res.status(200).json({
      success: true,
      users: result.users,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalUsers: result.totalUsers
    });
  } catch (error) {
    console.error("❌ [Controller] Error en getAllUsersController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// ➕ Crear usuario
export const createUserController = async (req, res) => {
  try {
    console.log("🟡 [Controller] Creando nuevo usuario...");
    
    const result = await createUser(req.body);
    
    if (!result.success) {
      console.log("🔴 [Controller] Error en use case:", result.message);
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    console.log("🟢 [Controller] Usuario creado exitosamente");
    res.status(201).json({
      success: true,
      message: result.message,
      user: result.user
    });
  } catch (error) {
    console.error("❌ [Controller] Error en createUserController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// ✏️ Actualizar usuario
export const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🟡 [Controller] Actualizando usuario ID: ${userId}`);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario no proporcionado"
      });
    }

    const result = await updateUser(userId, req.body);
    
    if (!result.success) {
      console.log("🔴 [Controller] Error en use case:", result.message);
      return res.status(404).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    console.log("🟢 [Controller] Usuario actualizado exitosamente");
    res.status(200).json({
      success: true,
      message: result.message,
      user: result.user
    });
  } catch (error) {
    console.error("❌ [Controller] Error en updateUserController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// 🗑️ Eliminar usuario
export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🟡 [Controller] Eliminando usuario ID: ${userId}`);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario no proporcionado"
      });
    }

    const result = await deleteUser(userId);
    
    if (!result.success) {
      console.log("🔴 [Controller] Error en use case:", result.message);
      return res.status(404).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    console.log("🟢 [Controller] Usuario eliminado exitosamente");
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error("❌ [Controller] Error en deleteUserController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// 📚 Obtener inscripciones de un curso específico
export const getCourseEnrollmentsController = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(`🟡 [Controller] Obteniendo inscripciones del curso ID: ${courseId}`);
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "ID de curso no proporcionado"
      });
    }

    const result = await getCourseEnrollments(courseId);
    
    if (!result.success) {
      console.log("🔴 [Controller] Error en use case:", result.message);
      return res.status(404).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    console.log("🟢 [Controller] Inscripciones del curso obtenidas exitosamente");
    res.status(200).json({
      success: true,
      enrollments: result.enrollments,
      course: result.course,
      totalEnrollments: result.totalEnrollments
    });
  } catch (error) {
    console.error("❌ [Controller] Error en getCourseEnrollmentsController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// 🔍 Buscar usuarios por criterios específicos
export const searchUsersController = async (req, res) => {
  try {
    const { query, role, dateFrom, dateTo } = req.query;
    console.log("🟡 [Controller] Buscando usuarios...", { query, role, dateFrom, dateTo });

    // Construir filtros de búsqueda
    const filters = {};
    
    if (query) {
      filters.$or = [
        { name: { $regex: query, $options: 'i' } },
        { lastname: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (role) {
      filters.role = role;
    }
    
    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filters.createdAt.$lte = new Date(dateTo);
    }

    const result = await getAllUsers({ ...req.query, filters });
    
    if (!result.success) {
      console.log("🔴 [Controller] Error en use case:", result.message);
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    console.log("🟢 [Controller] Búsqueda de usuarios completada exitosamente");
    res.status(200).json({
      success: true,
      users: result.users,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalUsers: result.totalUsers
    });
  } catch (error) {
    console.error("❌ [Controller] Error en searchUsersController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// 📊 Obtener resumen general del sistema
export const getSystemOverviewController = async (req, res) => {
  try {
    console.log("🟡 [Controller] Obteniendo resumen del sistema...");

    // Ejecutar múltiples use cases en paralelo
    const [dashboardStats, enrollmentStats, usersStats] = await Promise.all([
      getDashboardStats(),
      getEnrollmentStats('month'),
      getAllUsers({ page: 1, limit: 5 })
    ]);

    const overview = {
      dashboard: dashboardStats.success ? dashboardStats.stats : null,
      enrollments: enrollmentStats.success ? enrollmentStats.stats : null,
      recentUsers: usersStats.success ? usersStats.users : []
    };

    // Verificar si hubo errores en alguno de los use cases
    const hasErrors = !dashboardStats.success || !enrollmentStats.success || !usersStats.success;

    if (hasErrors) {
      console.log("🔴 [Controller] Algunos use cases fallaron");
      return res.status(207).json({ // 207 Multi-Status
        success: true,
        message: "Resumen obtenido con algunos errores",
        overview,
        errors: {
          dashboard: !dashboardStats.success ? dashboardStats.message : null,
          enrollments: !enrollmentStats.success ? enrollmentStats.message : null,
          users: !usersStats.success ? usersStats.message : null
        }
      });
    }

    console.log("🟢 [Controller] Resumen del sistema obtenido exitosamente");
    res.status(200).json({
      success: true,
      overview
    });
  } catch (error) {
    console.error("❌ [Controller] Error en getSystemOverviewController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};