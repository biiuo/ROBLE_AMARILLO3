import { useState, useEffect } from "react";
import { apiDeleteCourse, apiGetAllCourses, apiUpdateCourse } from "../../api/cursos";

export default function CourseList({ onEditCourse, refreshTrigger }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [editingPrice, setEditingPrice] = useState(null); // Para edición rápida de precio
  const [priceValue, setPriceValue] = useState("");

  useEffect(() => {
    loadCourses();
  }, [refreshTrigger]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🟡 Cargando cursos...");
      
      const result = await apiGetAllCourses();
      console.log("📚 Resultado de cursos:", result);
      
      if (result.ok) {
        const coursesData = result.data?.courses || result.data || [];
        setCourses(coursesData);
      } else {
        setError(result.error || "Error al cargar los cursos");
      }
    } catch (err) {
      console.error("❌ Error loading courses:", err);
      setError("Error de conexión al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const result = await apiDeleteCourse(courseId);
      if (result.ok) {
        setCourses(courses.filter(course => course._id !== courseId));
      } else {
        setError(result.error || "Error al eliminar el curso");
      }
    } catch (err) {
      setError("Error al eliminar el curso: " + err.message);
    }
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    try {
      const result = await apiUpdateCourse(courseId, { 
        isPublished: !currentStatus 
      });
      
      if (result.ok) {
        setCourses(courses.map(course => 
          course._id === courseId 
            ? { ...course, isPublished: !currentStatus }
            : course
        ));
      } else {
        setError(result.error || "Error al actualizar el curso");
      }
    } catch (err) {
      setError("Error al actualizar el curso: " + err.message);
    }
  };

  // Edición rápida de precio
  const startEditingPrice = (courseId, currentPrice) => {
    setEditingPrice(courseId);
    setPriceValue(currentPrice.toString());
  };

  const cancelEditingPrice = () => {
    setEditingPrice(null);
    setPriceValue("");
  };

  const savePrice = async (courseId) => {
    try {
      const newPrice = parseFloat(priceValue);
      if (isNaN(newPrice) || newPrice < 0) {
        setError("El precio debe ser un número válido mayor o igual a 0");
        return;
      }

      const result = await apiUpdateCourse(courseId, { 
        price: newPrice 
      });
      
      if (result.ok) {
        setCourses(courses.map(course => 
          course._id === courseId 
            ? { ...course, price: newPrice }
            : course
        ));
        setEditingPrice(null);
        setPriceValue("");
      } else {
        setError(result.error || "Error al actualizar el precio");
      }
    } catch (err) {
      setError("Error al actualizar el precio: " + err.message);
    }
  };

  // Filtrar cursos
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && course.isPublished) ||
                         (statusFilter === "draft" && !course.isPublished);
    
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const getLevelBadge = (level) => {
    const levels = {
      beginner: { label: "Principiante", color: "bg-green-100 text-green-800 border-green-200" },
      intermediate: { label: "Intermedio", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      advanced: { label: "Avanzado", color: "bg-red-100 text-red-800 border-red-200" }
    };
    return levels[level] || levels.beginner;
  };

  const getStatusBadge = (isPublished) => {
    return isPublished 
      ? { label: "Publicado", color: "bg-green-100 text-green-800 border-green-200" }
      : { label: "Borrador", color: "bg-gray-100 text-gray-800 border-gray-200" };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando cursos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Cursos</h2>
          <p className="text-gray-600 mt-1">
            {filteredCourses.length} de {courses.length} cursos mostrados
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar cursos
            </label>
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
            </select>
          </div>

          {/* Filtro por nivel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Todos los niveles</option>
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-700 hover:text-red-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tabla de Cursos */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Nivel
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Lecciones
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => {
                const levelBadge = getLevelBadge(course.level);
                const statusBadge = getStatusBadge(course.isPublished);
                
                return (
                  <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                    {/* Información del Curso */}
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        <div 
                          className="w-16 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                          style={{ 
                            backgroundImage: course.image 
                              ? `url(${course.image})` 
                              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {course.category || "Sin categoría"}
                      </span>
                    </td>

                    {/* Nivel */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${levelBadge.color}`}>
                        {levelBadge.label}
                      </span>
                    </td>

                    {/* Precio - Con edición rápida */}
                    <td className="px-6 py-4">
                      {editingPrice === course._id ? (
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                              $
                            </span>
                            <input
                              type="number"
                              value={priceValue}
                              onChange={(e) => setPriceValue(e.target.value)}
                              className="pl-6 pr-2 py-1 border border-gray-300 rounded text-sm w-20 focus:ring-1 focus:ring-yellow-500"
                              step="0.01"
                              min="0"
                              autoFocus
                            />
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => savePrice(course._id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={cancelEditingPrice}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center space-x-2 group cursor-pointer"
                          onClick={() => startEditingPrice(course._id, course.price || 0)}
                          title="Haz clic para editar el precio"
                        >
                          <span className={`text-sm font-medium ${
                            course.price > 0 ? 'text-gray-900' : 'text-green-600'
                          }`}>
                            {formatPrice(course.price || 0)}
                          </span>
                          <svg className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      )}
                    </td>

                    {/* Duración */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course.duration || "No especificada"}
                    </td>

                    {/* Lecciones */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium">
                        {course.lessons?.length || 0}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">lecciones</span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {/* Botón Publicar/Despublicar */}
                        <button
                          onClick={() => handleTogglePublish(course._id, course.isPublished)}
                          className={`p-2 rounded-lg transition-colors ${
                            course.isPublished 
                              ? "bg-orange-100 text-orange-600 hover:bg-orange-200" 
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                          title={course.isPublished ? "Despublicar" : "Publicar"}
                        >
                          {course.isPublished ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>

                        {/* Botón Editar */}
                        <button
                          onClick={() => onEditCourse(course)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Editar curso completo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Eliminar curso"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mensaje cuando no hay cursos */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {courses.length === 0 ? "No hay cursos creados" : "No se encontraron cursos"}
            </h3>
            <p className="text-gray-500">
              {courses.length === 0 
                ? "Comienza creando tu primer curso" 
                : "Intenta ajustar los filtros de búsqueda"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}