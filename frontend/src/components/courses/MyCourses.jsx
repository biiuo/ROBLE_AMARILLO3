import { useState, useEffect } from "react";
import { apiGetUserCourses, apiUnenrollCourse } from "../../api/cursos";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserCourses();
  }, []);

  const loadUserCourses = async () => {
    try {
      const result = await apiGetUserCourses();
      if (result.ok) {
        setCourses(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Error al cargar los cursos" + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (window.confirm("¿Estás seguro de que quieres salir de este curso?")) {
      try {
        const result = await apiUnenrollCourse(courseId);
        if (result.ok) {
          setCourses(courses.filter(course => course._id !== courseId));
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Error al salir del curso" + err.message);
      }
    }
  };

  const continueCourse = (courseId) => {
    // Navegar al curso
    console.log("Continuar curso:", courseId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tus cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Cursos</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {courses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No estás inscrito en ningún curso</h2>
              <p className="text-gray-600 mb-6">Explora nuestros cursos y comienza tu journey de aprendizaje</p>
              <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                Explorar Cursos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">{course.duration} horas</span>
                      <span className="text-sm font-medium text-yellow-600">
                        Progreso: {course.progress || 0}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => continueCourse(course._id)}
                        className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                      >
                        Continuar
                      </button>
                      <button
                        onClick={() => handleUnenroll(course._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Salir del curso"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}