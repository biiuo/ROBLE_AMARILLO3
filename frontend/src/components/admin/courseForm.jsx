import { useState, useEffect, useRef } from "react";
import { apiCreateCourse, apiUpdateCourse } from "../../api/cursos";

export default function CourseForm({ course, onCancel, onSuccess, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "web-development",
    price: 0,
    duration: "",
    level: "beginner",
    isPublished: false,
    image: "",
    imageFile: null // Nuevo campo para el archivo
  });
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState("");
  const [showLessons, setShowLessons] = useState(false);
  const [lessonsText, setLessonsText] = useState('');
  const fileInputRef = useRef(null);

  const isEditing = !!course?._id;

  const categories = [
    { value: "web-development", label: "Desarrollo Web" },
    { value: "mobile-development", label: "Desarrollo Móvil" },
    { value: "data-science", label: "Ciencia de Datos" },
    { value: "artificial-intelligence", label: "Inteligencia Artificial" },
    { value: "cybersecurity", label: "Ciberseguridad" },
    { value: "cloud-computing", label: "Computación en la Nube" },
    { value: "devops", label: "DevOps" },
    { value: "programming-fundamentals", label: "Fundamentos de Programación" },
    { value: "database", label: "Base de Datos" },
    { value: "ui-ux-design", label: "UI/UX Design" },
    { value: "game-development", label: "Desarrollo de Videojuegos" },
    { value: "blockchain", label: "Blockchain" }
  ];

  const levels = [
    { value: "beginner", label: "Principiante" },
    { value: "intermediate", label: "Intermedio" },
    { value: "advanced", label: "Avanzado" }
  ];

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "web-development",
        price: course.price || 0,
        duration: course.duration || "",
        level: course.level || "beginner",
        isPublished: course.isPublished || false,
        image: course.image || "",
        imageFile: null
      });
      // load lessons if present
      if (course.lessons && Array.isArray(course.lessons) && course.lessons.length > 0) {
        setShowLessons(true);
        setLessonsText(JSON.stringify(course.lessons, null, 2));
      } else {
        setShowLessons(false);
        setLessonsText('');
      }
    }
  }, [course]);

  

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    
    // Mostrar preview inmediatamente
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      image: previewUrl,
      imageFile: file
    }));
  };

  const handleRemoveImage = () => {
    if (formData.image && formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
    }
    setFormData(prev => ({
      ...prev,
      image: "",
      imageFile: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validaciones
      if (formData.title.length < 3) {
        setError("El título debe tener al menos 3 caracteres");
        setLoading(false);
        return;
      }

      if (!formData.duration) {
        setError("La duración es requerida");
        setLoading(false);
        return;
      }

      // Preparar datos para enviar (si hay archivo, lo incluimos y el backend lo procesará con multer)
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        duration: formData.duration,
        level: formData.level,
        isPublished: formData.isPublished,
        ...(formData.imageFile && { image: formData.imageFile }),
        // Si no hay archivo nuevo pero hay una URL existente (no preview blob), mantenerla
        ...(!formData.imageFile && formData.image && !formData.image.startsWith('blob:') && {
          image: formData.image
        })
      };

      // Si el usuario ha activado la sección de lecciones, parsear y añadirlas
      if (showLessons && lessonsText.trim()) {
        try {
          const parsed = JSON.parse(lessonsText);
          if (!Array.isArray(parsed)) throw new Error('Las lecciones deben ser un array');
          submitData.lessons = parsed;
        } catch (err) {
          setError('Formato de lecciones inválido: ' + err.message);
          setLoading(false);
          return;
        }
      }

      // Debug log para ayudar a verificar que se está enviando la imagen correcta
      console.log('📤 submitData antes de enviar:', {
        title: submitData.title,
        image: submitData.image,
        imagePublicId: submitData.imagePublicId,
        lessons: submitData.lessons ? submitData.lessons.length : 0
      });

      let result;
      if (typeof onSubmit === 'function') {
        // If parent passed an onSubmit handler, prefer it. When editing,
        // call with (id, data), otherwise call with (data).
        if (isEditing) {
          result = await onSubmit(course._id, submitData);
        } else {
          result = await onSubmit(submitData);
        }
      } else {
        // Fallback to internal API calls
        if (isEditing) {
          result = await apiUpdateCourse(course._id, submitData);
        } else {
          result = await apiCreateCourse(submitData);
        }
      }

      const success = (result && result.ok) || result === true;

      if (success) {
        // Limpiar URL del preview si existe
        if (formData.image && formData.image.startsWith('blob:')) {
          URL.revokeObjectURL(formData.image);
        }
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        const message = (result && result.error) ? result.error : "Error al guardar el curso";
        setError(message);
      }
    } catch (err) {
      setError("Error al guardar el curso: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Editar Curso" : "Crear Nuevo Curso"}
        </h3>
        <p className="text-gray-600 mt-1">
          {isEditing ? "Actualiza la información del curso" : "Completa la información para crear un nuevo curso"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Imagen del Curso */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Imagen del Curso
          </h4>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Preview de la imagen */}
            <div className="relative w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              {formData.image ? (
                <>
                  <img 
                    src={formData.image} 
                    alt="Preview del curso"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Input de archivo */}
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/jpg, image/png, image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="course-image"
              />
              <label
                htmlFor="course-image"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {formData.image ? "Cambiar Imagen" : "Seleccionar Imagen"}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG o WebP. Máximo 5MB
              </p>
            </div>

            
          </div>
        </div>

        {/* Resto del formulario (igual que antes) */}
        {/* Información Básica */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Información Básica
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Curso *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ej: React desde Cero - Guía Completa 2024"
              required
              minLength="3"
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 3 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Describe el contenido y objetivos del curso..."
              required
            />
          </div>
        </div>

        {/* Categorización */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Categorización
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel *
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lecciones (opcional, JSON) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Lecciones (opcional)</h4>
            <button
              type="button"
              onClick={() => {
                setShowLessons(s => !s);
                if (!showLessons && !lessonsText) {
                  // Prefill with example
                  setLessonsText(JSON.stringify([
                    {
                      title: "Introducción a React",
                      description: "Conceptos básicos y configuración del entorno de desarrollo",
                      videoUrl: "https://example.com/videos/react-intro.mp4",
                      duration: "45 minutos",
                      order: 1,
                      resources: [
                        { title: "Guía de instalación", url: "https://example.com/docs/install-guide.pdf", type: "pdf" }
                      ]
                    }
                  ], null, 2));
                }
              }}
              className="px-3 py-1 bg-gray-100 text-sm rounded hover:bg-gray-200"
            >
              {showLessons ? 'Ocultar' : 'Añadir lecciones (JSON)'}
            </button>
          </div>

          {showLessons && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lecciones (JSON)</label>
              <textarea
                value={lessonsText}
                onChange={(e) => setLessonsText(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
                placeholder='[ { "title": "...", "order": 1, "duration": "..." } ]'
              />
              <p className="text-xs text-gray-500 mt-1">Introduce un array de lecciones en formato JSON. Ejemplo disponible al mostrar la sección.</p>
            </div>
          )}
        </div>

        {/* Configuración del Curso */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Configuración del Curso
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={formData.price === 0 ? "" : formData.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange('price', value === "" ? 0 : parseFloat(value) || 0);
                  }}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">0 = Curso gratuito</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración *
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ej: 10 horas, 4 semanas"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Ej: 8 horas, 6 semanas</p>
            </div>
          </div>
        </div>

        {/* Publicación */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Publicación
          </h4>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Publicar curso
              </label>
              <p className="text-sm text-gray-500">
                {formData.isPublished 
                  ? "El curso será visible para los estudiantes" 
                  : "El curso permanecerá como borrador"
                }
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              formData.isPublished 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {formData.isPublished ? 'Publicado' : 'Borrador'}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>
              {loading 
                ? "Guardando..." 
                : (isEditing ? "Actualizar Curso" : "Crear Curso")
              }
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}