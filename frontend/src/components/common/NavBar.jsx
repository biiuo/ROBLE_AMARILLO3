export default function NavBar({ user, onNavigate, onLogout, currentView }) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            {/* Logo clickeable */}
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
            >
              <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
              <h1 className="text-xl font-bold text-gray-800">Roble Amarillo Fundamentals</h1>
            </button>

            {/* Navegación */}
            <nav className="hidden md:flex space-x-6">
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
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
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
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
