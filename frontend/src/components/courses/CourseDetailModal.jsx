import { useState } from "react";

export default function CourseDetailModal({ course, isOpen, onClose, onEnroll, enrolling, user }) {
  const [activeLesson, setActiveLesson] = useState(0);

  if (!isOpen || !course) return null;

  const isEnrolled = user?.enrolledCourses?.includes(course._id);
  const lessons = course.lessons || [];

  const handleEnroll = async () => {
    if (typeof onEnroll === "function") {
      await onEnroll(course._id);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con imagen */}
        <div className="relative h-64 bg-gray-300 overflow-hidden">
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500">
              <svg className="w-24 h-24 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
          )}

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Overlay con info rápida */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <div className="flex items-center space-x-4">
              <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-semibold">
                ${course.price || 0} USD
              </span>
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">
                {course.level === "beginner"
                  ? "Principiante"
                  : course.level === "intermediate"
                    ? "Intermedio"
                    : "Avanzado"}
              </span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>{lessons.length} lecciones</span>
              </span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-8">
          {/* Grid 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda - Info del curso */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Descripción del Curso</h2>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Duración</div>
                  <div className="text-xl font-bold text-gray-800">{course.duration}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Categoría</div>
                  <div className="text-xl font-bold text-gray-800">{course.category}</div>
                </div>
              </div>

              {/* Lecciones */}
              {lessons.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Contenido del Curso</h3>
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveLesson(index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          activeLesson === index
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-yellow-500 text-white font-bold text-sm">
                                {index + 1}
                              </span>
                              <h4 className="text-lg font-semibold text-gray-800">{lesson.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600 ml-11">{lesson.description}</p>
                            {lesson.duration && (
                              <div className="flex items-center space-x-2 mt-2 ml-11 text-xs text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{lesson.duration}</span>
                              </div>
                            )}
                          </div>
                          {activeLesson === index && (
                            <svg className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Detalle de la lección seleccionada */}
                  {lessons[activeLesson] && (
                    <div className="mt-8 p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">
                        {lessons[activeLesson].title}
                      </h4>
                      <p className="text-gray-700 mb-4">{lessons[activeLesson].description}</p>

                      {lessons[activeLesson].videoUrl && (
                        <div className="mb-4">
                          <a
                            href={lessons[activeLesson].videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>Ver video de la lección</span>
                          </a>
                        </div>
                      )}

                      {lessons[activeLesson].resources && lessons[activeLesson].resources.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-3">Recursos:</h5>
                          <div className="space-y-2">
                            {lessons[activeLesson].resources.map((resource, i) => (
                              <a
                                key={i}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-white transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm">{resource.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Columna derecha - Botón de acción */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-1">Precio</div>
                  <div className="text-3xl font-bold text-yellow-600">
                    ${course.price || 0}
                  </div>
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={enrolling || isEnrolled}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all ${
                    isEnrolled
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : enrolling
                        ? "bg-yellow-400 text-white opacity-75 cursor-not-allowed"
                        : "bg-yellow-500 text-white hover:bg-yellow-600 active:scale-95"
                  }`}
                >
                  {isEnrolled ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Ya estás inscrito</span>
                    </div>
                  ) : enrolling ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Inscribiendo...</span>
                    </div>
                  ) : (
                    "Comenzar Curso"
                  )}
                </button>

                <div className="mt-6 pt-6 border-t border-gray-300 space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Acceso de por vida</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{lessons.length} lecciones</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm">Aprende a tu ritmo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
