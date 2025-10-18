// src/App.jsx
import { useMemo, useState } from "react";
import { GiTreehouse } from "react-icons/gi"; // <- ícono del árbol

import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import CourseList from "./components/courses/CourseList.jsx";
import MyCourses from "./components/courses/MyCourses.jsx";
import Profile from "./components/user/Profile.jsx";

export default function App() {
  // Catálogo fijo (demo)
  const courses = useMemo(
    () => [
      { id: 1, title: "HTML & CSS Básico", level: "Principiante", duration: "3h" },
      { id: 2, title: "JavaScript desde cero", level: "Intermedio", duration: "5h" },
      { id: 3, title: "Python para principiantes", level: "Principiante", duration: "4h" },
      { id: 4, title: "React con Vite y Tailwind", level: "Avanzado", duration: "6h" },
      { id: 5, title: "Git y GitHub", level: "Intermedio", duration: "2.5h" },
    ],
    []
  );

  // Usuarios/sesión (en memoria)
  const [users, setUsers] = useState([
    { email: "jorge@raf.com", password: "123456", name: "Jorge" },
  ]);
  const [currentUser, setCurrentUser] = useState(null);

  // Inscripciones por usuario (email → [ids])
  const [enrollments, setEnrollments] = useState({});

  // Vistas
  const [view, setView] = useState("courses");      
  const [authView, setAuthView] = useState("login"); 

  /* ------------ AUTH ------------ */
  const login = (email, password) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setCurrentUser({ email: found.email, name: found.name, password: found.password });
      setView("courses");
      return true;
    }
    return false;
  };

  const register = ({ name, email, password }) => {
    const exists = users.some((u) => u.email === email);
    if (exists) return false;
    const newUser = { name, email, password };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser({ email, name, password });
    setView("courses");
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthView("login");
  };

  /* ------------ USER ------------ */
  const updateUser = (partial) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.email === currentUser.email ? { ...u, ...partial } : u))
    );
    setCurrentUser((prev) => ({ ...prev, ...partial }));
  };

  const deleteUser = () => {
    if (!currentUser) return;
    const email = currentUser.email;
    setUsers((prev) => prev.filter((u) => u.email !== email));
    setEnrollments((prev) => {
      const copy = { ...prev };
      delete copy[email];
      return copy;
    });
    setCurrentUser(null);
    setAuthView("login");
  };

  /* ------------ COURSES ------------ */
  const userEnrolls = currentUser ? enrollments[currentUser.email] || [] : [];

  const enroll = (courseId) => {
    if (!currentUser) return;
    setEnrollments((prev) => {
      const list = prev[currentUser.email] || [];
      if (list.includes(courseId)) return prev;
      return { ...prev, [currentUser.email]: [...list, courseId] };
    });
  };

  const unenroll = (courseId) => {
    if (!currentUser) return;
    setEnrollments((prev) => {
      const list = prev[currentUser.email] || [];
      return { ...prev, [currentUser.email]: list.filter((id) => id !== courseId) };
    });
  };

  return (
    <div className="min-h-screen bg-roble-light">
      {/* Navbar con paleta roble e ícono */}
      <header className="bg-roble-primary text-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GiTreehouse className="text-roble-dark text-4xl" />
            <h1 className="text-3xl font-extrabold tracking-wide text-roble-dark">
              Roble Amarillo Fundamentals
            </h1>
          </div>

          {currentUser ? (
            <nav className="flex items-center gap-2">
              {[
                ["courses", "Cursos"],
                ["my", "Mis cursos"],
                ["profile", "Perfil"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`px-3 py-1.5 rounded-md text-sm border transition
                    ${view === key
                      ? "bg-white text-roble-dark border-white"
                      : "border-white/80 text-white hover:bg-white/10"}`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-md text-sm border border-white/80 text-white hover:bg-white/10 transition"
              >
                Salir
              </button>
            </nav>
          ) : null}
        </div>
      </header>

      {/* Contenido */}
      {!currentUser ? (
        authView === "login" ? (
          <Login onSubmit={login} onSwitch={() => setAuthView("register")} />
        ) : (
          <Register onSubmit={register} onSwitch={() => setAuthView("login")} />
        )
      ) : (
        <main className="max-w-5xl mx-auto p-6">
          {view === "courses" && (
            <CourseList
              courses={courses}
              enrolledIds={userEnrolls}
              onEnroll={enroll}        // en "Cursos": solo inscribir
            />
          )}

          {view === "my" && (
            <MyCourses
              courses={courses}
              enrolledIds={userEnrolls}
              onUnenroll={unenroll}    // en "Mis cursos": eliminar
            />
          )}

          {view === "profile" && (
            <Profile
              user={users.find((u) => u.email === currentUser.email)}
              onUpdate={updateUser}
              onDelete={deleteUser}
            />
          )}
        </main>
      )}
    </div>
  );
}
