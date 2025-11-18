const API_URL = import.meta.env.VITE_API_URL;

export async function apiUpdateUser(userId, data) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    if (!res.ok) {
      return { ok: false, error: json.message || "Error al actualizar usuario" };
    }

    return { ok: true, data: json.data };
  } catch (err) {
    return { ok: false, error: "Error de conexión" +err.message };
  }
}

export async function apiDeleteUser(userId) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const json = await res.json();

    if (!res.ok) {
      return { ok: false, error: json.message || "Error al eliminar usuario" };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: "Error de conexión" +err.message };
  }
}