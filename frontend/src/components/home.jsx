import { useState, useEffect } from "react";
import { apiGetCourses } from "../api/cursos";

export default function Home({ user, onLogout, onOpenLogin, onOpenRegister, currentView, onNavigate }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar cursos públicos
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const result = await apiGetCourses();
      if (result.ok) {
        setCourses(result.data || []);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (courseId) => {
    if (!user) {
      onOpenRegister();
      return;
    }
    // Lógica para inscribirse al curso
    console.log("Inscribirse al curso:", courseId);
    // Aquí podrías llamar a apiEnrollCourse(courseId)
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
              
              {/* Navegación para usuarios logueados */}
              {user && (
                <nav className="flex space-x-6">
                  <button
                    onClick={() => onNavigate("home")}
                    className={`font-medium transition-colors ${
                      currentView === "home" 
                        ? "text-yellow-600" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Inicio
                  </button>
                  <button
                    onClick={() => onNavigate("my-courses")}
                    className={`font-medium transition-colors ${
                      currentView === "my-courses" 
                        ? "text-yellow-600" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Mis Cursos
                  </button>
                  <button
                    onClick={() => onNavigate("profile")}
                    className={`font-medium transition-colors ${
                      currentView === "profile" 
                        ? "text-yellow-600" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Mi Perfil
                  </button>
                  {user?.isAdmin && (
                    <button
                      onClick={() => onNavigate("admin")}
                      className={`font-medium transition-colors ${
                        currentView === "admin" 
                          ? "text-yellow-600" 
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Admin
                    </button>
                  )}
                </nav>
              )}
            </div>
            
            {/* Botones de Auth o Perfil */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">Hola, {user?.name}!</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={onOpenLogin}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={onOpenRegister}
                    className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Resto del contenido de la página */}
      <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {user ? `¡Bienvenido de vuelta, ${user.name}!` : "Aprende con Roble Amarillo"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-yellow-100">
            Plataforma educativa de excelencia para tu crecimiento profesional
          </p>
          {!user && (
            <button
              onClick={onOpenRegister}
              className="px-8 py-4 bg-white text-yellow-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Comenzar Ahora - Es Gratis
            </button>
          )}
        </div>
      </section>

      {/* Cursos Destacados */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Cursos Destacados
            </h2>
            <p className="text-gray-600 text-lg">
              Descubre nuestros cursos más populares y comienza tu journey de aprendizaje
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando cursos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course._id} className="bg-gray-50 rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-500"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">{course.duration} horas</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.level}
                      </span>
                    </div>

                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                    >
                      {user ? "Inscribirse" : "Regístrate para acceder"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="py-16 bg-gray-800 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">
              ¿Listo para comenzar tu journey?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Únete a miles de estudiantes que ya están aprendiendo con nosotros
            </p>
            <button
              onClick={onOpenRegister}
              className="px-8 py-4 bg-yellow-500 text-white rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors"
            >
              Crear Cuenta Gratuita
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Roble Amarillo Fundamentals. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}