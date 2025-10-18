export default function MyCourses({ courses, enrolledIds, onUnenroll }) {
  const myCourses = courses.filter((c) => enrolledIds.includes(c.id));

  return (
    <section>
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">
        Mis cursos
      </h2>

      {myCourses.length === 0 ? (
        <p className="text-slate-500">No estás inscrito en ningún curso aún.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {myCourses.map((c) => (
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
              <button
                onClick={() => onUnenroll(c.id)}
                className="mt-3 rounded-lg px-3 py-2 text-sm bg-lime-700 text-white hover:bg-lime-800 transition"
              >
                Eliminar de mis cursos
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
