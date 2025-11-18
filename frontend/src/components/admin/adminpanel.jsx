import { useState } from "react";
import CourseList from "./CourseList";
import CourseForm from "./CourseForm";

export default function AdminPanel({ user }) {
  const [activeTab, setActiveTab] = useState("courses");
  const [editingCourse, setEditingCourse] = useState(null);

  // Verificar si el usuario es admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder al panel de administración.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
            <p className="text-gray-600">Gestiona cursos y usuarios de la plataforma</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("courses")}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "courses" 
                    ? "border-yellow-500 text-yellow-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                📚 Gestión de Cursos
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "users" 
                    ? "border-yellow-500 text-yellow-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                👥 Gestión de Usuarios
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "courses" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Cursos</h2>
                    <button
                      onClick={() => setEditingCourse({})}
                      className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      + Crear Nuevo Curso
                    </button>
                  </div>

                  {editingCourse ? (
                    <CourseForm 
                      course={editingCourse} 
                      onCancel={() => setEditingCourse(null)}
                      onSuccess={() => {
                        setEditingCourse(null);
                        // Recargar lista
                      }}
                    />
                  ) : (
                    <CourseList onEditCourse={setEditingCourse} />
                  )}
                </div>
              )}

              {activeTab === "users" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h2>
                  <p className="text-gray-600">Aquí puedes gestionar los usuarios de la plataforma (pendiente de implementar).</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}