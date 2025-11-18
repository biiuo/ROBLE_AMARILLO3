import { useState } from "react";

export default function Register({ onSubmit, onSwitch, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    // Validación de nombre
    if (!formData.name.trim()) {
      return "El nombre es requerido";
    }

    if (formData.name.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }

    // Validación de apellido
    if (!formData.lastname.trim()) {
      return "El apellido es requerido";
    }

    if (formData.lastname.trim().length < 2) {
      return "El apellido debe tener al menos 2 caracteres";
    }

    // Validación de username
    if (!formData.username.trim()) {
      return "El nombre de usuario es requerido";
    }

    if (formData.username.trim().length < 3) {
      return "El nombre de usuario debe tener al menos 3 caracteres";
    }

    // Validación de email
    if (!formData.email.trim()) {
      return "El email es requerido";
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(formData.email)) {
      return "El formato del email no es válido";
    }

    // Validación de contraseña
    if (!formData.password) {
      return "La contraseña es requerida";
    }

    if (formData.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }

    // Validación de confirmación de contraseña
    if (!formData.confirmPassword) {
      return "Debes confirmar tu contraseña";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden";
    }

    return null; // No hay errores
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Limpiar error cuando el usuario escriba
  };

  const handleSubmit = async (e) => {
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
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      
      if (!result.ok) {
        setError(result.error.message || "Error al registrar usuario");
      }
    } catch (err) {
      setError("Error inesperado. Intenta nuevamente."+ err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header con botón cerrar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Crear cuenta</h2>
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Tu apellido"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de usuario
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Tu nombre de usuario"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
            disabled={loading}
          />
        </div>

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
              Creando cuenta...
            </div>
          ) : (
            "Crear cuenta"
          )}
        </button>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <button 
              type="button" 
              className="text-yellow-600 font-medium hover:text-yellow-700 underline transition-colors disabled:opacity-50" 
              onClick={onSwitch}
              disabled={loading}
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}