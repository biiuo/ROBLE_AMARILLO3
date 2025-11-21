import Enrollment from "../../models/enrollment.model.js";

export const getCourseEnrollments = async (courseId) => {
  try {
    const enrollments = await Enrollment.find({ course: courseId })
      .populate('user', 'name email username')
      .populate('course', 'title')
      .sort({ enrolledAt: -1 });

    return {
      success: true,
      enrollments
    };
  } catch (error) {
    console.error("Error getting course enrollments:", error);
    throw error;
  }
};

export const getEnrollmentStats = async (timeRange = 'month') => {
  try {
    let dateFilter = {};
    const now = new Date();
    
    switch (timeRange) {
      case 'week':
        dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
        break;
      case 'month':
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
        break;
      case 'year':
        dateFilter = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
        break;
      default:
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
    }

    // Estadísticas de inscripciones por fecha
    const enrollmentStats = await Enrollment.aggregate([
      {
        $match: {
          enrolledAt: dateFilter
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$enrolledAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Inscripciones por curso
    const courseEnrollmentStats = await Enrollment.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      {
        $unwind: '$courseInfo'
      },
      {
        $group: {
          _id: '$courseInfo.title',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return {
      success: true,
      stats: {
        enrollmentStats,
        courseEnrollmentStats
      }
    };
  } catch (error) {
    console.error("Error getting enrollment stats:", error);
    throw error;
  }
};