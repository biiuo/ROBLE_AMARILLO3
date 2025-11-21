import { CATEGORIES, getCategoryLabel, getCategoryIcon } from "../../utils/categories";

export default function CourseFilters({ filters, onFilterChange, onClearFilters }) {
  const getLevelBadge = (level) => {
    const levels = {
      beginner: { label: "Principiante", color: "bg-green-100 text-green-800" },
      intermediate: { label: "Intermedio", color: "bg-yellow-100 text-yellow-800" },
      advanced: { label: "Avanzado", color: "bg-red-100 text-red-800" }
    };
    return levels[level] || levels.beginner;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrar Cursos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro por categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={filters.category || ""}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Todas las categorías</option>
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {getCategoryIcon(key)} {label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por nivel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nivel
          </label>
          <select
            value={filters.level || ""}
            onChange={(e) => onFilterChange('level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Todos los niveles</option>
            <option value="beginner">👶 Principiante</option>
            <option value="intermediate">🚀 Intermedio</option>
            <option value="advanced">🔥 Avanzado</option>
          </select>
        </div>

        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      {(filters.category || filters.level || filters.search) && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Filtros aplicados: 
            {filters.category && ` Categoría: ${getCategoryLabel(filters.category)}`}
            {filters.level && ` Nivel: ${getLevelBadge(filters.level).label}`}
            {filters.search && ` Búsqueda: "${filters.search}"`}
          </p>
          <button
            onClick={onClearFilters}
            className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}