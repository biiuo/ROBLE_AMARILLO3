export default function DashboardStats({ stats, courses }) {
  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
      </div>
    );
  }

  // Datos seguros con valores por defecto y cálculos protegidos
  const safeStats = {
    totalCourses: stats.totalCourses || 0,
    totalUsers: stats.totalUsers || 0,
    totalEnrollments: stats.totalEnrollments || 0,
    publishedCourses: stats.publishedCourses || 0,
    pendingCourses: stats.pendingCourses || 0
  };

  // Cálculos seguros para evitar divisiones por cero
  const publicationRate = safeStats.totalCourses > 0 
    ? Math.round((safeStats.publishedCourses / safeStats.totalCourses) * 100) 
    : 0;

  const enrollmentsPerUser = safeStats.totalUsers > 0 
    ? Math.round(safeStats.totalEnrollments / safeStats.totalUsers) 
    : 0;

  const enrollmentsPerCourse = safeStats.totalCourses > 0 
    ? Math.round(safeStats.totalEnrollments / safeStats.totalCourses) 
    : 0;

  const coursesWithLessons = courses.filter(c => c.lessons?.length > 0).length;

  const statCards = [
    {
      title: "Total Cursos",
      value: safeStats.totalCourses,
      icon: "📚",
      color: "blue",
      description: `${safeStats.publishedCourses} publicados, ${safeStats.pendingCourses} borradores`
    },
    {
      title: "Total Usuarios",
      value: safeStats.totalUsers,
      icon: "👥",
      color: "green",
      description: "Usuarios registrados"
    },
    {
      title: "Inscripciones",
      value: safeStats.totalEnrollments,
      icon: "🎓",
      color: "yellow",
      description: "Total de inscripciones"
    },
    {
      title: "Cursos Publicados",
      value: safeStats.publishedCourses,
      icon: "✅",
      color: "green",
      description: "Cursos disponibles"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const color = getColorClasses(stat.color);
          return (
            <div key={index} className={`bg-white p-6 rounded-xl shadow-sm border ${color.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${color.bg}`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid de Información */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cursos Recientes */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cursos Recientes</h3>
          <div className="space-y-3">
            {courses && courses.slice(0, 5).map((course) => (
              <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm line-clamp-1">{course.title}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {course.category} • {course.level}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  course.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.isPublished ? 'Publicado' : 'Borrador'}
                </span>
              </div>
            ))}
            {(!courses || courses.length === 0) && (
              <p className="text-gray-500 text-center py-4">No hay cursos creados</p>
            )}
          </div>
        </div>

        {/* Resumen de Estado */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Estado</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Cursos Publicados</span>
                <span>{safeStats.publishedCourses} / {safeStats.totalCourses}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${publicationRate}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Tasa de Inscripción</span>
                <span>{enrollmentsPerUser} por usuario</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(enrollmentsPerUser * 10, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Ocupación de Cursos</span>
                <span>{enrollmentsPerCourse} inscripciones/curso</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(enrollmentsPerCourse * 10, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{safeStats.totalCourses}</div>
              <div className="text-xs text-blue-700">Total Cursos</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{safeStats.totalUsers}</div>
              <div className="text-xs text-green-700">Total Usuarios</div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-purple-600">{publicationRate}%</div>
          <div className="text-sm text-gray-600">Tasa de Publicación</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-blue-600">{enrollmentsPerUser}</div>
          <div className="text-sm text-gray-600">Promedio Inscripciones</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-green-600">{enrollmentsPerCourse}</div>
          <div className="text-sm text-gray-600">Inscripciones por Curso</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-yellow-600">{coursesWithLessons}</div>
          <div className="text-sm text-gray-600">Cursos con Lecciones</div>
        </div>
      </div>
    </div>
  );
}