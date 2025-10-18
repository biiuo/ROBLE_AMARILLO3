import { useState } from "react";

export default function Register({ onSubmit, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (pwd1.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (pwd1 !== pwd2) return setError("Las contraseñas no coinciden.");
    const ok = onSubmit?.({ name: name.trim(), email: email.trim().toLowerCase(), password: pwd1 });
    if (!ok) setError("Ese correo ya existe.");
  };

  const inputCls =
    "w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-roble-primary";

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-2xl bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Crear cuenta</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Correo</label>
          <input
            type="email"
            className={inputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@raf.com"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              className={inputCls}
              value={pwd1}
              onChange={(e) => setPwd1(e.target.value)}
              placeholder="••••••"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Repetir</label>
            <input
              type="password"
              className={inputCls}
              value={pwd2}
              onChange={(e) => setPwd2(e.target.value)}
              placeholder="••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-roble-primary text-white px-4 py-2 rounded-lg hover:bg-roble-dark transition"
        >
          Crear cuenta
        </button>

        <p className="text-sm text-slate-600 text-center">
          ¿Ya tienes cuenta?{" "}
          <button type="button" className="text-roble-primary underline" onClick={onSwitch}>
            Inicia sesión
          </button>
        </p>
      </form>
    </div>
  );
}
