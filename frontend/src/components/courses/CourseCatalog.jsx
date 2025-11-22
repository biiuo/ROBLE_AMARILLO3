import { useState, useEffect, useCallback } from "react";
import {
  apiGetCourses,
  apiEnrollCourse,
  apiGetMyCourses,
} from "../../api/cursos";
import {
  CATEGORIES,
  getCategoryLabel,
  getCategoryIcon,
} from "../../utils/categories";
import CourseDetailModal from "./CourseDetailModal";

// Importar la URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CourseCatalog({ user, onNavigate }) {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    search: "",
  });
  const [imageErrors, setImageErrors] = useState({});

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());

  // Función helper para obtener la URL completa de la imagen
  const getImageUrl = (imagePath) => {
    console.log("🔄 Procesando imagen:", imagePath);

    if (!imagePath) {
      console.log("❌ No hay imagePath");
      return null;
    }

    // Si la imagen ya es una URL completa (http/https), devolverla tal cual
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      console.log("✅ URL completa, devolviendo tal cual");
      return imagePath;
    }

    // Si es una ruta de Cloudinary (empieza con /v o contiene cloudinary)
    if (imagePath.includes("cloudinary") || imagePath.startsWith("/v")) {
      // Asegurar que tenga el protocolo
      if (!imagePath.startsWith("http")) {
        return `https://res.cloudinary.com${
          imagePath.startsWith("/") ? "" : "/"
        }${imagePath}`;
      }
      return imagePath;
    }

    // Para rutas locales del servidor
    let cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

    // Remover slash duplicado si existe
    if (cleanPath.startsWith("//")) {
      cleanPath = cleanPath.substring(1);
    }

    const fullUrl = `${API_BASE_URL}${cleanPath}`;
    console.log("🔗 URL construida:", fullUrl);

    return fullUrl;
  };

  const handleImageError = (courseId) => {
    console.log("❌ Error cargando imagen para curso:", courseId);
    setImageErrors((prev) => ({
      ...prev,
      [courseId]: true,
    }));
  };

  // Cargar cursos inscritos cuando el usuario cambie
  useEffect(() => {
    if (user) {
      loadEnrolledCourses();
    }
  }, [user]);

  const loadEnrolledCourses = async () => {
    try {
      const result = await apiGetMyCourses();
      if (result.ok) {
        const enrolledIds =
          result.data?.courses?.map((course) => course._id) || [];
        setEnrolledCourses(new Set(enrolledIds));
      }
    } catch (error) {
      console.error("Error loading enrolled courses:", error);
    }
  };

  // Función para verificar si un curso está inscrito
  const isCourseEnrolled = (courseId) => {
    return enrolledCourses.has(courseId);
  };

  // FUNCIÓN HANDLE ENROLL CORREGIDA (sin duplicados)
  const handleEnroll = async (courseId) => {
    if (!user) {
      setSelectedCourse(courseId);
      setAuthView("login");
      setShowAuthModal(true);
      return;
    }

    setEnrolling(courseId);
    try {
      const result = await apiEnrollCourse(courseId);
      if (result.ok) {
        // Actualizar el estado local de cursos inscritos
        setEnrolledCourses((prev) => new Set([...prev, courseId]));

        // También actualizar el estado de courses
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === courseId ? { ...course, isEnrolled: true } : course
          )
        );
      } else {
        alert(result.error || "Error al inscribirse en el curso");
      }
    } catch (err) {
      alert("Error de conexión al inscribirse: " + err.message);
    } finally {
      setEnrolling(null);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [user]);

  // Función para verificar si la imagen es accesible
  const checkImageAvailability = async (imageUrl) => {
    if (!imageUrl) return false;

    try {
      const response = await fetch(imageUrl, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      console.log("❌ Imagen no accesible:", imageUrl);
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    // Verificar disponibilidad de imágenes cuando se cargan los cursos
    const verifyImages = async () => {
      for (const course of courses) {
        if (course.image) {
          const imageUrl = getImageUrl(course.image);
          const isAvailable = await checkImageAvailability(imageUrl);
          if (!isAvailable) {
            setImageErrors((prev) => ({
              ...prev,
              [course._id]: true,
            }));
          }
        }
      }
    };

    if (courses.length > 0) {
      verifyImages();
    }
  }, [courses]);

  const filterCourses = useCallback(() => {
    let filtered = courses;

    if (filters.category) {
      filtered = filtered.filter(
        (course) => course.category === filters.category
      );
    }

    if (filters.level) {
      filtered = filtered.filter((course) => course.level === filters.level);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCourses(filtered);
  }, [courses, filters]);

  useEffect(() => {
    filterCourses();
  }, [filterCourses]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiGetCourses();

      if (result.ok) {
        const raw = result.data;

        const coursesData = Array.isArray(raw?.courses)
          ? raw.courses
          : Array.isArray(raw)
          ? raw
          : [];

        console.log("📦 Cursos cargados:", coursesData.length);
        console.log(
          "🖼️ Primer curso:",
          coursesData[0]
            ? {
                title: coursesData[0].title,
                image: coursesData[0].image,
                imageUrl: getImageUrl(coursesData[0].image),
              }
            : "No hay cursos"
        );

        // Si el usuario está logueado, cargar información de inscripción
        if (user) {
          const myCoursesResult = await apiGetMyCourses();
          if (myCoursesResult.ok) {
            const enrolledCourseIds =
              myCoursesResult.data?.courses?.map((course) => course._id) || [];

            const coursesWithEnrollment = coursesData.map((course) => ({
              ...course,
              isEnrolled: enrolledCourseIds.includes(course._id),
            }));

            setCourses(coursesWithEnrollment);
            // También actualizar enrolledCourses
            setEnrolledCourses(new Set(enrolledCourseIds));
          } else {
            setCourses(coursesData);
          }
        } else {
          setCourses(coursesData);
        }
      } else {
        setError(result.error || "Error al cargar los cursos");
      }
    } catch (err) {
      console.error("Error loading courses:", err);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleLoginSuccess = () => {
    setShowAuthModal(false);
    if (selectedCourse) {
      handleEnroll(selectedCourse);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      level: "",
      search: "",
    });
  };

  const getLevelBadge = (level) => {
    const levels = {
      beginner: { label: "Principiante", color: "bg-green-100 text-green-800" },
      intermediate: {
        label: "Intermedio",
        color: "bg-yellow-100 text-yellow-800",
      },
      advanced: { label: "Avanzado", color: "bg-red-100 text-red-800" },
    };
    return levels[level] || levels.beginner;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => onNavigate("home")}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
              >
                <svg
                  className="w-8 h-8 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                </svg>
                <h1 className="text-xl font-bold text-gray-800">
                  Catálogo de Cursos
                </h1>
              </button>

              <nav className="flex space-x-6">
                <button
                  onClick={() => onNavigate("home")}
                  className="font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Inicio
                </button>
                <button
                  onClick={() => onNavigate("my-courses")}
                  className="font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Mis Cursos
                </button>
                <button className="font-medium text-yellow-600 transition-colors">
                  Catálogo
                </button>
              </nav>
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <button
                    onClick={() => onNavigate("profile")}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none"
                    title="Ir a perfil"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="font-medium text-gray-800">Hola, {user.name}!</span>
                  </button>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Descubre Nuestros Cursos
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-yellow-100 max-w-3xl mx-auto">
            Aprende las tecnologías más demandadas del mercado con nuestros
            cursos especializados
          </p>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Filtrar Cursos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Todas las categorías</option>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {getCategoryIcon(key)} {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel
              </label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange("level", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Todos los niveles</option>
                <option value="beginner">👶 Principiante</option>
                <option value="intermediate">🚀 Intermedio</option>
                <option value="advanced">🔥 Avanzado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {(filters.category || filters.level || filters.search) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Filtros aplicados:
                {filters.category &&
                  ` Categoría: ${getCategoryLabel(filters.category)}`}
                {filters.level &&
                  ` Nivel: ${getLevelBadge(filters.level).label}`}
                {filters.search && ` Búsqueda: "${filters.search}"`}
              </p>
              <button
                onClick={clearFilters}
                className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Información de resultados */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredCourses.length}{" "}
              {filteredCourses.length === 1
                ? "curso encontrado"
                : "cursos encontrados"}
            </h2>
          </div>
        </div>

        {/* Grid de Cursos */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const levelBadge = getLevelBadge(course.level);
              const isEnrolling = enrolling === course._id;

              return (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Imagen del curso */}
                  <div className="h-48 relative overflow-hidden">
                    {course.image && !imageErrors[course._id] ? (
                      <img
                        src={getImageUrl(course.image)}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(course._id)}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-white opacity-80"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                        </svg>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${levelBadge.color}`}
                      >
                        {levelBadge.label}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {getCategoryIcon(course.category)}{" "}
                        {getCategoryLabel(course.category)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">
                        {course.duration}
                      </span>
                      <span className="text-lg font-bold text-yellow-600">
                        {course.price === 0 ? "Gratis" : `$${course.price}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{course.lessons?.length || 0} lecciones</span>
                      <span>Por {course.createdBy?.name || "Instructor"}</span>
                    </div>

                    <button
                      onClick={() => setSelectedCourse(course)}
                      disabled={isEnrolling}
                      className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                      {isEnrolling ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Cargando...
                        </div>
                      ) : (
                        "Ver Detalles"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No se encontraron cursos
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {filters.category || filters.level || filters.search
                ? "No hay cursos que coincidan con tus criterios de búsqueda. Intenta con otros filtros."
                : "No hay cursos disponibles en este momento."}
            </p>

            {(filters.category || filters.level || filters.search) && (
              <button
                onClick={clearFilters}
                className="px-8 py-4 bg-yellow-500 text-white rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors"
              >
                Ver todos los cursos
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de Autenticación */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {authView === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </h2>
              <p className="text-gray-600 mb-6">
                {authView === "login"
                  ? "Inicia sesión para inscribirte en este curso"
                  : "Crea una cuenta para comenzar tu aprendizaje"}
              </p>

              <div className="space-y-4">
                {authView === "login" ? (
                  <>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Usuario o email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <button
                      onClick={handleLoginSuccess}
                      className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                    >
                      Iniciar Sesión
                    </button>
                    <p className="text-center text-gray-600">
                      ¿No tienes cuenta?{" "}
                      <button
                        onClick={() => setAuthView("register")}
                        className="text-yellow-600 hover:text-yellow-700 font-medium"
                      >
                        Regístrate aquí
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <button
                      onClick={handleLoginSuccess}
                      className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                    >
                      Crear Cuenta
                    </button>
                    <p className="text-center text-gray-600">
                      ¿Ya tienes cuenta?{" "}
                      <button
                        onClick={() => setAuthView("login")}
                        className="text-yellow-600 hover:text-yellow-700 font-medium"
                      >
                        Inicia sesión aquí
                      </button>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del curso */}
      <CourseDetailModal
        course={selectedCourse && typeof selectedCourse === "object" ? selectedCourse : null}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={handleEnroll}
        enrolling={enrolling}
        user={user}
      />
    </div>
  );
}