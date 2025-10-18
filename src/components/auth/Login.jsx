import { useState } from "react";

export default function Login({ onSubmit, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const ok = onSubmit?.(email.trim().toLowerCase(), password);
    if (!ok) setError("Credenciales inválidas.");
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-2xl bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Iniciar sesión</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Correo</label>
          <input
            type="email"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-roble-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jorge@raf.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <div className="flex gap-2">
            <input
              type={showPwd ? "text" : "password"}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-roble-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="px-3 py-2 rounded-lg border text-sm hover:bg-roble-light"
            >
              {showPwd ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-roble-primary text-white px-4 py-2 rounded-lg hover:bg-roble-dark transition"
        >
          Entrar
        </button>

        <p className="text-sm text-slate-600 text-center">
          ¿No tienes cuenta?{" "}
          <button type="button" className="text-roble-primary underline" onClick={onSwitch}>
            Regístrate
          </button>
        </p>
      </form>
    </div>
  );
}
