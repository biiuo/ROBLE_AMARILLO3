import { useState, useEffect } from "react";
import { apiUpdateUser, apiDeleteUser } from "../../api/user";

export default function UserProfile({ user, onUserUpdate, onLogout }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        lastname: user.lastname || "",
        username: user.username || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await apiUpdateUser(user._id, formData);
      if (result.ok) {
        setSuccess("Perfil actualizado correctamente");
        onUserUpdate(result.data);
        setEditMode(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Error al actualizar el perfil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      setLoading(true);
      try {
        const result = await apiDeleteUser(user._id);
        if (result.ok) {
          onLogout();
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Error al eliminar la cuenta" + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              {editMode ? "Cancelar" : "Editar Perfil"}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    disabled={!editMode || loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    disabled={!editMode || loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    disabled={!editMode || loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    disabled={!editMode || loading}
                  />
                </div>
              </div>

              {editMode && (
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6 border-red-200">
            <h2 className="text-xl font-bold text-red-700 mb-4">Zona de Peligro</h2>
            <p className="text-gray-600 mb-4">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, sé seguro.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              Eliminar Mi Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}