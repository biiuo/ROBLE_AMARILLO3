import User from "../../models/user.model.js";
import Course from "../../models/course.model.js";
import Enrollment from "../../models/enrollment.model.js";

export const getDashboardStats = async () => {
  try {
    console.log("📊 Obteniendo estadísticas del dashboard...");

    // Obtener todos los conteos en paralelo
    const [
      totalCourses,
      totalUsers,
      totalEnrollments,
      publishedCourses,
      coursesWithLessons
    ] = await Promise.all([
      Course.countDocuments(),
      User.countDocuments(),
      Enrollment.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      Course.countDocuments({ "lessons.0": { $exists: true } })
    ]);

    console.log("✅ Conteos obtenidos:", {
      totalCourses,
      totalUsers,
      totalEnrollments,
      publishedCourses,
      coursesWithLessons
    });

    const pendingCourses = totalCourses - publishedCourses;

    // Calcular métricas adicionales con protección contra división por cero
    const enrollmentRate = totalUsers > 0 ? (totalEnrollments / totalUsers) : 0;
    const avgEnrollmentsPerCourse = totalCourses > 0 ? (totalEnrollments / totalCourses) : 0;
    const publicationRate = totalCourses > 0 ? (publishedCourses / totalCourses) * 100 : 0;

    const stats = {
      totalCourses,
      totalUsers,
      totalEnrollments,
      publishedCourses,
      pendingCourses,
      coursesWithLessons,
      enrollmentRate: Math.round(enrollmentRate * 100) / 100,
      avgEnrollmentsPerCourse: Math.round(avgEnrollmentsPerCourse * 100) / 100,
      publicationRate: Math.round(publicationRate * 100) / 100
    };

    console.log("📈 Estadísticas calculadas:", stats);

    return {
      success: true,
      stats
    };

  } catch (error) {
    console.error("❌ Error en getDashboardStats use case:", error);
    return {
      success: false,
      message: "Error al obtener las estadísticas del dashboard",
      error: error.message
    };
  }
};export const getUserEnrollmentsWithPayments = async (queryParams = {}) => {
  try {
    const { page = 1, limit = 50, search = '' } = queryParams;

    // Construir query para búsqueda
    const userQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(userQuery)
      .select('name lastname username email role createdAt ID')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Obtener todas las inscripciones con información de cursos
    const enrollments = await Enrollment.find()
      .populate('user', 'name email username')
      .populate('course', 'title price category level isPublished')
      .sort({ enrolledAt: -1 });

    // Estructurar los datos para el frontend
    const usersWithEnrollments = users.map(user => {
      const userEnrollments = enrollments.filter(enrollment => 
        enrollment.user && enrollment.user._id.toString() === user._id.toString()
      );

      const enrolledCourses = userEnrollments.map(enrollment => ({
        courseId: enrollment.course?._id,
        courseTitle: enrollment.course?.title || 'Curso no disponible',
        courseCategory: enrollment.course?.category,
        courseLevel: enrollment.course?.level,
        coursePrice: enrollment.course?.price || 0,
        coursePublished: enrollment.course?.isPublished || false,
        progress: enrollment.progress,
        completed: enrollment.completed,
        enrolledAt: enrollment.enrolledAt,
        lastAccessed: enrollment.lastAccessed
      }));

      // Calcular total pagado (suma de precios de cursos inscritos)
      const totalPaid = enrolledCourses.reduce((sum, course) => sum + course.coursePrice, 0);

      return {
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        role: user.role,
        ID: user.ID,
        createdAt: user.createdAt,
        enrolledCourses,
        totalEnrollments: enrolledCourses.length,
        totalPaid,
        lastEnrollment: enrolledCourses.length > 0 ? 
          enrolledCourses[0].enrolledAt : null
      };
    });

    const totalUsers = await User.countDocuments(userQuery);

    return {
      success: true,
      users: usersWithEnrollments,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
      totalUsers: usersWithEnrollments.length,
      totalEnrollments: enrollments.length,
      totalRevenue: usersWithEnrollments.reduce((sum, user) => sum + user.totalPaid, 0)
    };
  } catch (error) {
    console.error("Error in getUserEnrollmentsWithPayments use case:", error);
    return {
      success: false,
      message: "Error al obtener los usuarios e inscripciones",
      error: error.message
    };
  }
};

export const getAllUsers = async (queryParams = {}) => {
  try {
    const { page = 1, limit = 10, search = '' } = queryParams;

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await User.countDocuments(query);

    // Obtener estadísticas de inscripciones por usuario
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const enrollmentsCount = await Enrollment.countDocuments({ user: user._id });
        const completedCourses = await Enrollment.countDocuments({ 
          user: user._id, 
          completed: true 
        });

        return {
          ...user.toObject(),
          enrollmentsCount,
          completedCourses
        };
      })
    );

    return {
      success: true,
      users: usersWithStats,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
      totalUsers
    };
  } catch (error) {
    console.error("Error in getAllUsers use case:", error);
    return {
      success: false,
      message: "Error al obtener los usuarios",
      error: error.message
    };
  }
};

export const getUserEnrollmentsWithPaymentsController = async (req, res) => {
  try {
    // Para admin, obtener todos los usuarios con sus inscripciones
    const { page = 1, limit = 50, search = '' } = req.query;
    
    const result = await getUserEnrollmentsWithPayments({ 
      page: parseInt(page), 
      limit: parseInt(limit), 
      search 
    });
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error in getUserEnrollmentsWithPaymentsController:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

export const getUserEnrollmentsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await getUserEnrollmentsWithPayments(userId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error in getUserEnrollmentsController:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};