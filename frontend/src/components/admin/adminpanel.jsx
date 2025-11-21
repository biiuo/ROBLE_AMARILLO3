import { useState, useEffect } from "react";
import { apiGetAllCourses, apiCreateCourse, apiUpdateCourse, apiDeleteCourse } from "../../api/cursos";
import { apiGetDashboardStats, apiGetAllUsers, apiCreateUser, apiUpdateUser, apiDeleteUser } from "../../api/admin";
import CourseForm from "./courseForm";
import CourseList from "./courseList";
import UserManagement from "./usermanagment";
import DashboardStats from "./dashboardstats";

export default function AdminPanel({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [coursesResult, statsResult] = await Promise.all([
        apiGetAllCourses(),
        apiGetDashboardStats()
      ]);

      if (coursesResult.ok) {
        setCourses(coursesResult.data.courses || coursesResult.data || []);
      } else {
        setError(coursesResult.error);
      }

      if (statsResult.ok) {
        setStats(statsResult.data.stats);
      } else {
        setError(statsResult.error);
      }

    } catch (err) {
      console.error("Error loading admin data:", err);
      setError("Error cargando datos del administrador");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const result = await apiGetAllUsers();
      if (result.ok) {
        setUsers(result.data.users || result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Error cargando usuarios");
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      const result = await apiCreateCourse(courseData);
      if (result.ok) {
        await loadInitialData();
        setActiveTab("courses");
        setEditingCourse(null);
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError("Error creando curso" + err.message);
      return false;
    }
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    try {
      const result = await apiUpdateCourse(courseId, courseData);
      if (result.ok) {
        await loadInitialData();
        setActiveTab("courses");
        setEditingCourse(null);
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError("Error actualizando curso" + err.message);
      return false;
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.")) {
      return false;
    }

    try {
      const result = await apiDeleteCourse(courseId);
      if (result.ok) {
        await loadInitialData();
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError("Error eliminando curso" + err.message);
      return false;
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const result = await apiCreateUser(userData);
      if (result.ok) {
        await loadUsers();
        setEditingUser(null);
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError("Error creando usuario" + err.message);
      return false;
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const result = await apiUpdateUser(userId, userData);
      if (result.ok) {
        await loadUsers();
        setEditingUser(null);
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError("Error actualizando usuario" + err.message);
      return false;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.")) {
      return false;
    }

    try {
      const result = await apiDeleteUser(userId);
      if (result.ok) {
        await loadUsers();
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError("Error eliminando usuario" + err.message);
      return false;
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setActiveTab("create-course");
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditingUser(null);
    setActiveTab("courses");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
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
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
                <h1 className="text-xl font-bold text-gray-800">Panel de Administración</h1>
              </div>
              
              <nav className="flex space-x-6">
                <button
                  onClick={() => onNavigate("home")}
                  className="font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Inicio
                </button>
                <button className="font-medium text-yellow-600 transition-colors">
                  Admin
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-800">Hola, {user.name}!</p>
                <p className="text-sm text-gray-600">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs de Navegación */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: "dashboard", name: "Dashboard", icon: "📊" },
              { id: "courses", name: "Cursos", icon: "📚" },
              { id: "create-course", name: editingCourse ? "Editar Curso" : "Crear Curso", icon: editingCourse ? "✏️" : "➕" },
              { id: "users", name: "Usuarios", icon: "👥" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "users") {
                    loadUsers();
                  }
                  if (tab.id === "create-course" && editingCourse) {
                    setEditingCourse(null);
                  }
                }}
                className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-6 py-8">
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

        {/* Renderizar contenido según la pestaña activa */}
        {activeTab === "dashboard" && (
          <DashboardStats stats={stats} courses={courses} users={users} />
        )}

        {activeTab === "courses" && (
          <CourseList 
            courses={courses}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        )}

        {activeTab === "create-course" && (
          <CourseForm 
            course={editingCourse}
            onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
            onCancel={handleCancelEdit}
            isEditing={!!editingCourse}
          />
        )}

        {activeTab === "users" && (
          <UserManagement 
            users={users}
            editingUser={editingUser}
            onEditUser={handleEditUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onCreateUser={handleCreateUser}
            onCancelEdit={() => setEditingUser(null)}
          />
        )}
      </div>
    </div>
  );
}