import { useMemo, useState } from "react";

export default function CourseList({ courses, enrolledIds, onEnroll }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? courses.filter(c => c.title.toLowerCase().includes(s)) : courses;
  }, [q, courses]);

  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">
          Cursos disponibles
        </h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar curso..."
          className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-600"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((c) => {
          const isIn = enrolledIds.includes(c.id);
          return (
            <article
              key={c.id}
              className="p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-yellow-700 text-lg">
                {c.title}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Nivel: {c.level} · Duración: {c.duration}
              </p>

              <div className="mt-3">
                {isIn ? (
                  <span className="text-green-600 font-medium">✅ Inscrito!</span>
                ) : (
                  <button
                    onClick={() => onEnroll(c.id)}
                    className="rounded-lg px-3 py-2 text-sm bg-yellow-600 text-white hover:bg-yellow-700 transition"
                  >
                    Inscribirme
                  </button>
                )}
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-slate-500 col-span-full text-center">
            No se encontraron cursos.
          </p>
        )}
      </div>
    </section>
  );
}
