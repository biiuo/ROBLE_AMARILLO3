
const BASE_URL = import.meta.env.VITE_API_URL|| import.meta.VITE_API_URL_LOCAL;



export async function apiLogin(data) {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
