import { useState } from "react";

export default function Profile({ user, onUpdate, onDelete }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: user?.password || "",
  });
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onUpdate({ ...form });
    setEditing(false);
    setMsg("Perfil actualizado.");
    setTimeout(() => setMsg(""), 1500);
  };

  const confirmDelete = () => {
    if (confirm("¿Seguro que deseas eliminar tu perfil? Esta acción es irreversible.")) {
      onDelete();
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Perfil</h2>

      {!editing ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-2">
          <p><span className="font-medium">Nombre:</span> {user.name}</p>
          <p><span className="font-medium">Correo:</span> {user.email}</p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-2 rounded-lg border hover:bg-slate-50"
            >
              Editar perfil
            </button>
            <button
              onClick={confirmDelete}
              className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:opacity-90"
            >
              Eliminar perfil
            </button>
          </div>

          {msg && <p className="text-green-600 text-sm mt-2">{msg}</p>}
        </div>
      ) : (
        <form onSubmit={save} className="rounded-xl border bg-white p-6 shadow-sm space-y-3">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Correo</label>
            <input
              type="email"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value.toLowerCase() }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={form.password || ""}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••"
              minLength={6}
            />
            <p className="text-xs text-slate-500 mt-1">
              *Demo sin BD. La contraseña se guarda solo en memoria.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:opacity-95"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-3 py-2 rounded-lg border hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
