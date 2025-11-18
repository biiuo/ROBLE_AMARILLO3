import { useState } from "react";

export default function Login({ onSubmit, onSwitch, onClose }) {
  const [identifier, setIdentifier] = useState("");  // email O username
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    // Validación de campo vacío
    if (!identifier.trim()) {
      return "El usuario o email es requerido";
    }
    
    // Validación de formato email si es un email
    if (identifier.includes("@")) {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(identifier)) {
        return "El formato del email no es válido";
      }
    }
    
    // Validación de contraseña
    if (!password.trim()) {
      return "La contraseña es requerida";
    }
    
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    
    // Validaciones del frontend
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(""); // Limpiar errores anteriores
    setLoading(true);

    try {
      // Llamar a onSubmit que está en App.jsx
      const result = await onSubmit({ 
        identifier: identifier.trim(), 
        password 
      });
      
      if (!result.ok) {
        // Mostrar el mensaje de error específico del backend
        setError(result.error.message || "Credenciales inválidas");
      }
    } catch (err) {
      setError("Error inesperado. Intenta nuevamente. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(""); // Limpiar error cuando el usuario escriba
  };

  return (
    <div className="p-6">
      {/* Header con botón cerrar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Iniciar sesión</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo o username
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
            value={identifier}
            onChange={handleInputChange(setIdentifier)}
            placeholder="jorge@raf.com o jorge123"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="flex gap-2">
            <input
              type={showPwd ? "text" : "password"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder="••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {showPwd ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </div>
          ) : (
            "Entrar"
          )}
        </button>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <button 
              type="button" 
              className="text-yellow-600 font-medium hover:text-yellow-700 underline transition-colors disabled:opacity-50" 
              onClick={onSwitch}
              disabled={loading}
            >
              Regístrate
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}