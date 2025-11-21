const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';



export async function apiLogin(data) {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
