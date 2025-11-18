import { useState, useEffect } from "react";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./components/home";
import UserProfile from "./components/user/Profile";
import MyCourses from "./components/courses/MyCourses";
import AdminPanel from "./components/admin/adminpanel";

// Import API
import { apiRegister } from "./api/register";
import { apiLogin } from "./api/login";

export default function App() {
  const [currentView, setCurrentView] = useState("home"); // home | profile | my-courses | admin
  const [authView, setAuthView] = useState("login"); // login | register
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay usuario logueado al cargar la app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Aquí podrías hacer una llamada para verificar el token
        // Por ahora, asumimos que el token es válido
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
        🔐 HANDLER: REGISTER
     =============================== */
  const handleRegister = async (data) => {
    const result = await apiRegister(data);

    if (!result.ok) {
      return { ok: false, error: { message: result.error } };
    }

    console.log("Usuario creado:", result.data);
    
    // Guardar usuario en estado y localStorage
    setUser(result.data);
    localStorage.setItem("user", JSON.stringify(result.data));
    localStorage.setItem("token", result.data.token);
    
    setShowAuthModal(false);
    setCurrentView("home");

    return { ok: true };
  };

  /* ===============================
        🔐 HANDLER: LOGIN
     =============================== */
  const handleLogin = async ({ identifier, password }) => {
    console.log("Handle login called with:", { identifier, password });

    if (!identifier || identifier.trim().length === 0) {
      return { ok: false, error: { message: "El usuario o email es requerido" } };
    }
    if (!password || password.trim().length === 0) {
      return { ok: false, error: { message: "La contraseña es requerida" } };
    }
    const isEmail = identifier.includes("@");
    if (isEmail) {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(identifier)) {
        return { ok: false, error: { message: "El formato del email no es válido" } };
      }
    }

    const data = { identifier, password };
    const result = await apiLogin(data);

    if (result.error) {
      return { ok: false, error: { message: result.error } };
    }

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    setUser(result.user);
    setShowAuthModal(false);
    setCurrentView("home");

    return { ok: true };
  };

  /* ===============================
        🔓 LOGOUT
     =============================== */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentView("home");
    setShowAuthModal(false);
  };

  /* ===============================
        🎯 HANDLERS AUTH MODAL
     =============================== */
  const openLogin = () => {
    setAuthView("login");
    setShowAuthModal(true);
  };

  const openRegister = () => {
    setAuthView("register");
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthView("login");
  };

  /* ===============================
        🎯 HANDLER UPDATE USER
     =============================== */
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  /* ===============================
            🖥️ RENDER
     =============================== */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Renderizar la vista actual */}
      {!user ? (
        // Usuario no logueado - Solo Home público
        <Home 
          user={user} 
          onLogout={logout}
          onOpenLogin={openLogin}
          onOpenRegister={openRegister}
          currentView={currentView}
          onNavigate={setCurrentView}
        />
      ) : (
        // Usuario logueado - Vista según navegación
        <>
          {currentView === "home" && (
            <Home 
              user={user} 
              onLogout={logout}
              onOpenLogin={openLogin}
              onOpenRegister={openRegister}
              currentView={currentView}
              onNavigate={setCurrentView}
            />
          )}
          {currentView === "profile" && (
            <UserProfile 
              user={user} 
              onUserUpdate={handleUserUpdate}
              onLogout={logout}
            />
          )}
          {currentView === "my-courses" && (
            <MyCourses user={user} />
          )}
          {currentView === "admin" && (
            <AdminPanel user={user} />
          )}
        </>
      )}

      {/* Modal de Autenticación */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative">
            {authView === "login" ? (
              <Login
                onSubmit={handleLogin}
                onSwitch={() => setAuthView("register")}
                onClose={closeAuthModal}
              />
            ) : (
              <Register
                onSubmit={handleRegister}
                onSwitch={() => setAuthView("login")}
                onClose={closeAuthModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}