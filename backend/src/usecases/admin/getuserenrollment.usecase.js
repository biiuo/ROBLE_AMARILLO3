import User from "../../models/user.model.js";
import Enrollment from "../../models/enrollment.model.js";



// Versión específica para un solo usuario
export const getUserEnrollments = async (userId) => {
  try {
    console.log(`👤 Obteniendo inscripciones para usuario: ${userId}`);

    // Verificar que el usuario existe
    const user = await User.findById(userId)
      .select('name lastname username email role createdAt ID')
      .lean();

    if (!user) {
      return {
        success: false,
        message: "Usuario no encontrado"
      };
    }

    // Obtener inscripciones del usuario
    const enrollments = await Enrollment.find({ user: userId })
      .populate('course', 'title price category level isPublished duration lessons')
      .sort({ enrolledAt: -1 })
      .lean();

    console.log(`📚 ${enrollments.length} inscripciones encontradas para ${user.name}`);

    const enrolledCourses = enrollments.map(enrollment => ({
      courseId: enrollment.course?._id,
      courseTitle: enrollment.course?.title || 'Curso no disponible',
      courseCategory: enrollment.course?.category,
      courseLevel: enrollment.course?.level,
      coursePrice: enrollment.course?.price || 0,
      coursePublished: enrollment.course?.isPublished || false,
      courseDuration: enrollment.course?.duration,
      courseLessons: enrollment.course?.lessons?.length || 0,
      progress: enrollment.progress || 0,
      completed: enrollment.completed || false,
      enrolledAt: enrollment.enrolledAt,
      lastAccessed: enrollment.lastAccessed || enrollment.enrolledAt
    }));

    // Calcular métricas
    const totalPaid = enrolledCourses.reduce((sum, course) => sum + course.coursePrice, 0);
    const completedCourses = enrolledCourses.filter(course => course.completed).length;
    const averageProgress = enrolledCourses.length > 0 
      ? enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length
      : 0;

    return {
      success: true,
      user: {
        ...user,
        enrolledCourses,
        totalEnrollments: enrolledCourses.length,
        totalPaid,
        completedCourses,
        averageProgress: Math.round(averageProgress),
        lastEnrollment: enrolledCourses.length > 0 ? enrolledCourses[0].enrolledAt : null
      }
    };

  } catch (error) {
    console.error("❌ Error en getUserEnrollments use case:", error);
    return {
      success: false,
      message: "Error al obtener las inscripciones del usuario",
      error: error.message
    };
  }
};

// Estadísticas de inscripciones por período de tiempo
export const getEnrollmentStats = async (timeRange = 'month') => {
  try {
    console.log(`📊 Obteniendo estadísticas de inscripciones para: ${timeRange}`);

    let dateFilter = {};
    const now = new Date();
    
    switch (timeRange) {
      case 'week':
        dateFilter = { enrolledAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
        break;
      case 'month':
        dateFilter = { enrolledAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
        break;
      case 'quarter':
        dateFilter = { enrolledAt: { $gte: new Date(now.setMonth(now.getMonth() - 3)) } };
        break;
      case 'year':
        dateFilter = { enrolledAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } };
        break;
      default:
        dateFilter = { enrolledAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
    }

    const enrollments = await Enrollment.find(dateFilter)
      .populate('course', 'price')
      .populate('user', 'name email')
      .lean();

    // Calcular estadísticas
    const totalEnrollments = enrollments.length;
    const totalRevenue = enrollments.reduce((sum, enrollment) => 
      sum + (enrollment.course?.price || 0), 0
    );
    
    const uniqueUsers = [...new Set(enrollments.map(e => e.user?._id?.toString()).filter(Boolean))].length;
    
    // Agrupar por día para gráficos
    const dailyStats = enrollments.reduce((acc, enrollment) => {
      const date = new Date(enrollment.enrolledAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { enrollments: 0, revenue: 0 };
      }
      acc[date].enrollments += 1;
      acc[date].revenue += enrollment.course?.price || 0;
      return acc;
    }, {});

    return {
      success: true,
      stats: {
        totalEnrollments,
        totalRevenue,
        uniqueUsers,
        averageRevenuePerUser: uniqueUsers > 0 ? totalRevenue / uniqueUsers : 0,
        dailyStats: Object.entries(dailyStats).map(([date, data]) => ({
          date,
          enrollments: data.enrollments,
          revenue: data.revenue
        })).sort((a, b) => a.date.localeCompare(b.date))
      }
    };

  } catch (error) {
    console.error("❌ Error en getEnrollmentStats use case:", error);
    return {
      success: false,
      message: "Error al obtener las estadísticas de inscripciones",
      error: error.message
    };
  }
};