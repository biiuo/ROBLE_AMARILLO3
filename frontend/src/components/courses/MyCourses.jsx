import { useState, useEffect } from "react";
import { apiGetMyCourses } from "../../api/cursos.js";

export default function MyCourses({ user, onNavigate }) {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await apiGetMyCourses();
      
      if (result.ok) {
        // Manejar diferentes estructuras de respuesta
        const coursesData = result.data.courses || result.data || [];
        setMyCourses(coursesData);
      } else {
        setError(result.error || "Error al cargar tus cursos");
      }
    } catch (err) {
      console.error("Error loading my courses:", err);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleExploreCourses = () => {
    onNavigate("catalog");
  };

  const handleContinueLearning = (course) => {
    // Aquí puedes implementar la navegación al reproductor del curso
    console.log("Continuar curso:", course);
    alert(`Continuar con: ${course.title}`);
  };

  const getCourseProgress = (course) => {
    return course.progress || course.enrollment?.progress || 0;
  };

  const getLevelBadge = (level) => {
    const levels = {
      beginner: { label: "Principiante", color: "bg-green-100 text-green-800" },
      intermediate: { label: "Intermedio", color: "bg-yellow-100 text-yellow-800" },
      advanced: { label: "Avanzado", color: "bg-red-100 text-red-800" }
    };
    return levels[level] || levels.beginner;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con Navegación */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo y Navegación */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
                <h1 className="text-xl font-bold text-gray-800">Roble Amarillo Fundamentals</h1>
              </div>
              
              <nav className="flex space-x-6">
                <button
                  onClick={() => onNavigate("home")}
                  className="font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Inicio
                </button>
                <button
                  onClick={() => onNavigate("my-courses")}
                  className="font-medium text-yellow-600 transition-colors"
                >
                  Mis Cursos
                </button>
                <button
                  onClick={() => onNavigate("catalog")}
                  className="font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Catálogo
                </button>
                <button
                  onClick={() => onNavigate("profile")}
                  className="font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Mi Perfil
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => onNavigate("admin")}
                    className="font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Admin
                  </button>
                )}
              </nav>
            </div>
            
            {/* Información del usuario */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-800">Hola, {user.name}!</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Cursos</h1>
          <p className="text-gray-600">
            Gestiona y continúa con tu aprendizaje
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando tus cursos...</p>
          </div>
        ) : myCourses.length > 0 ? (
          // Vista cuando tiene cursos
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => {
              const progress = getCourseProgress(course);
              const courseData = course.course || course;
              const levelBadge = getLevelBadge(courseData.level);
              
              return (
                <div key={courseData._id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  {/* Imagen del curso */}
                  <div 
                    className="h-40 relative bg-cover bg-center"
                    style={{ 
                      backgroundImage: courseData.image 
                        ? `url(${courseData.image})` 
                        : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium">
                        Progreso: {progress}%
                      </span>
                    </div>
                    {!courseData.image && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {courseData.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {courseData.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">{courseData.duration}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelBadge.color}`}>
                        {levelBadge.label}
                      </span>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleContinueLearning(courseData)}
                        className="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                      >
                        {progress > 0 ? 'Continuar' : 'Comenzar'}
                      </button>
                      
                      {/* Botón para ver detalles */}
                      <button
                        onClick={() => console.log("Ver detalles:", courseData._id)}
                        className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        title="Ver detalles del curso"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Vista cuando no tiene cursos
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No estás inscrito en ningún curso
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Explora nuestros cursos y comienza tu journey de aprendizaje. Encuentra cursos que se adapten a tus intereses y nivel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleExploreCourses}
                className="px-8 py-4 bg-yellow-500 text-white rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors"
              >
                Explorar Cursos
              </button>
              <button
                onClick={() => onNavigate("home")}
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        )}

        {/* Estadísticas (solo si hay cursos) */}
        {myCourses.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tu Progreso General</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {myCourses.length}
                </div>
                <div className="text-sm text-yellow-700">Cursos Inscritos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {myCourses.filter(course => getCourseProgress(course) === 100).length}
                </div>
                <div className="text-sm text-green-700">Cursos Completados</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {Math.round(myCourses.reduce((acc, course) => acc + getCourseProgress(course), 0) / myCourses.length)}%
                </div>
                <div className="text-sm text-blue-700">Progreso Promedio</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}