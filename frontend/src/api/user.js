// api/user.js
const BASE_URL = import.meta.env.VITE_API_URL|| 'http://localhost:5000';

/* ===============================
        UPDATE USER
     =============================== */
export const apiUpdateUser = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!token || !user) {
      return {
        ok: false,
        error: "No hay sesión activa"
      };
    }

    // Usar el username del usuario logueado como identifier
    const identifier = user.username;

    console.log("Enviando actualización para:", identifier);
    console.log("Datos:", formData);

    const response = await fetch(`${BASE_URL}/user/update/${identifier}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    console.log("Status de respuesta:", response.status);

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Respuesta no JSON:", text);
      return {
        ok: false,
        error: "Error del servidor. Intenta nuevamente."
      };
    }

    const result = await response.json();
    console.log("Respuesta del servidor:", result);
    
    if (response.ok) {
      return {
        ok: true,
        data: result.user || result.data
      };
    } else {
      return {
        ok: false,
        error: result.message || result.error || "Error al actualizar usuario"
      };
    }
  } catch (error) {
    console.error("API Update Error:", error);
    return {
      ok: false,
      error: "Error de conexión. Verifica tu internet."
    };
  }
};

/* ===============================
        DELETE USER
     =============================== */
export const apiDeleteUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      return {
        ok: false,
        error: "No hay sesión activa"
      };
    }

    const identifier = user.username;

    const response = await fetch(`${BASE_URL}/user/delete/${identifier}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    // Si la respuesta no trae JSON, manejar cuerpo vacío o HTML
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      if (response.ok) {
        return {
          ok: true,
          message: "Usuario eliminado correctamente"
        };
      } else {
        const text = await response.text();
        return {
          ok: false,
          error: text || `Error del servidor (status ${response.status})`
        };
      }
    }

    const result = await response.json();

    if (!response.ok) {
      return { ok: false, error: result.message || result.error || "Error al eliminar usuario" };
    }

    return { ok: true, message: result.message, data: result.deleted || result.deletedUser || result };
  } catch (error) {
    console.error("API Delete Error:", error);
    return { ok: false, error: "Error de conexión al eliminar usuario: " + error.message };
  }
};