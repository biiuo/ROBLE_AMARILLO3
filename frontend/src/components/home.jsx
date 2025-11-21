import { useState, useEffect } from "react";
import { apiGetCourses } from "../api/cursos";

export default function Home({ user, onLogout, onOpenLogin, onOpenRegister, currentView, onNavigate }) {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar cursos destacados
  useEffect(() => {
    loadFeaturedCourses();
  }, []);

  const loadFeaturedCourses = async () => {
    try {
      const result = await apiGetCourses();
      
      if (result.ok) {
        // La API devuelve los cursos en result.data.courses
        const coursesArray = result.data?.courses || [];
        setFeaturedCourses(coursesArray.slice(0, 3));
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // VISTA PARA USUARIOS NO LOGUEADOS (Landing Page Completa)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Simple para no logueados */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
                <h1 className="text-xl font-bold text-gray-800">Roble Amarillo Fundamentals</h1>
              </div>
              
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
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Aprende con Roble Amarillo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-yellow-100">
              Plataforma educativa de excelencia para tu crecimiento profesional
            </p>
            <button
              onClick={onOpenRegister}
              className="px-8 py-4 bg-white text-yellow-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Comenzar Ahora - Es Gratis
            </button>
          </div>
        </section>

        {/* Cursos Destacados - VISIBLES PARA TODOS */}
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
            ) : featuredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCourses.map((course) => (
                  <div key={course._id} className="bg-gray-50 rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                      </svg>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">{course.duration}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                          course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.level === 'beginner' ? 'Principiante' : 
                           course.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                        </span>
                      </div>

                      <button
                        onClick={onOpenRegister}
                        className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                      >
                        Inscribirse en el Curso
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No hay cursos disponibles</h3>
                <p className="text-gray-600">Próximamente tendremos nuevos cursos para ti.</p>
              </div>
            )}
          </div>
        </section>

        {/* Información sobre la plataforma */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                ¿Qué ofrece nuestra plataforma?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Cursos de Calidad</h3>
                <p className="text-gray-600">Aprende con contenido actualizado y profesionales expertos</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Certificados</h3>
                <p className="text-gray-600">Obtén certificados que validen tus conocimientos</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Comunidad</h3>
                <p className="text-gray-600">Únete a una comunidad de estudiantes y profesionales</p>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios adicionales */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Aprende a tu propio ritmo
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-800">Acceso 24/7</h4>
                      <p className="text-gray-600">Aprende cuando quieras, desde cualquier dispositivo</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-800">Proyectos prácticos</h4>
                      <p className="text-gray-600">Aplica lo aprendido en proyectos del mundo real</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-800">Soporte personalizado</h4>
                      <p className="text-gray-600">Recibe ayuda de instructores y la comunidad</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">¡Comienza Hoy!</h3>
                <p className="mb-6 text-yellow-100">Únete a miles de estudiantes que ya están transformando sus carreras</p>
                <button
                  onClick={onOpenRegister}
                  className="px-6 py-3 bg-white text-yellow-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  Crear Cuenta Gratis
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action final */}
        <section className="py-16 bg-gray-800 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">
              ¿Listo para comenzar tu journey?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Regístrate ahora y accede a todos nuestros cursos, certificados y una comunidad de aprendizaje activa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onOpenRegister}
                className="px-8 py-4 bg-yellow-500 text-white rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors"
              >
                Crear Cuenta Gratuita
              </button>
              <button
                onClick={onOpenLogin}
                className="px-8 py-4 border border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-gray-800 transition-colors"
              >
                Ya tengo cuenta
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo y descripción */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                  </svg>
                  <h3 className="text-xl font-bold">Roble Amarillo Fundamentals</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Plataforma educativa de excelencia para tu crecimiento profesional. 
                  Aprende las habilidades más demandadas del mercado.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Enlaces rápidos */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Inicio</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cursos</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Precios</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Contacto</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>📧 info@robleamarillo.com</li>
                  <li>📞 +1 (555) 123-4567</li>
                  <li>📍 Ciudad, País</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                © 2024 Roble Amarillo Fundamentals. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // VISTA PARA USUARIOS LOGUEADOS (Dashboard simple)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header completo con navegación */}
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
                  className={`font-medium transition-colors ${
                    currentView === "home" 
                      ? "text-yellow-600" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Inicio
                </button>
                <button
                  onClick={() => onNavigate("catalog")}
                  className={`font-medium transition-colors ${
                    currentView === "catalog" 
                      ? "text-yellow-600" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Catálogo
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
                {user?.role === "admin" && (
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
            </div>
            
            {/* Información del usuario */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-800">Hola, {user.name}!</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal para usuarios logueados */}
      <main className="container mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ¡Bienvenido de vuelta, {user.name}!
          </h1>
          <p className="text-yellow-100 text-lg mb-6">
            Continúa tu journey de aprendizaje con nosotros
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate("catalog")}
              className="px-6 py-3 bg-white text-yellow-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Explorar Cursos
            </button>
            <button
              onClick={() => onNavigate("my-courses")}
              className="px-6 py-3 border border-white text-white rounded-lg font-bold hover:bg-white hover:text-yellow-600 transition-colors"
            >
              Ver Mis Cursos
            </button>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Explorar Cursos</h3>
            <p className="text-gray-600 text-sm mb-4">Descubre nuevos cursos para tu crecimiento</p>
            <button
              onClick={() => onNavigate("catalog")}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Ver catálogo →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Mis Cursos</h3>
            <p className="text-gray-600 text-sm mb-4">Continúa donde lo dejaste</p>
            <button
              onClick={() => onNavigate("my-courses")}
              className="text-green-600 hover:text-green-800 font-medium text-sm"
            >
              Ver mis cursos →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Mi Perfil</h3>
            <p className="text-gray-600 text-sm mb-4">Gestiona tu información personal</p>
            <button
              onClick={() => onNavigate("profile")}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm"
            >
              Editar perfil →
            </button>
          </div>
        </div>
      </main>

      {/* Footer para usuarios logueados */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 Roble Amarillo Fundamentals. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}