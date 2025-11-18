const API_URL = import.meta.env.VITE_API_URL;



export async function apiLogin(data) {
  const res = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
