// src/api/register.js
const BASE_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function apiRegister(data) {
  try {
    const res = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    if (!res.ok) {
      return { ok: false, error: json.message || "Error al registrar" };
    }

    return { ok: true, data: json };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
