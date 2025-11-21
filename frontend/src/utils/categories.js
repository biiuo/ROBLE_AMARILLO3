// utils/categories.js
export const CATEGORIES = {
  "web-development": "Desarrollo Web",
  "mobile-development": "Desarrollo Móvil", 
  "data-science": "Ciencia de Datos",
  "artificial-intelligence": "Inteligencia Artificial",
  "cybersecurity": "Ciberseguridad",
  "cloud-computing": "Computación en la Nube",
  "devops": "DevOps",
  "programming-fundamentals": "Fundamentos de Programación",
  "database": "Bases de Datos",
  "ui-ux-design": "Diseño UI/UX",
  "game-development": "Desarrollo de Videojuegos",
  "blockchain": "Blockchain"
};

export const CATEGORY_ICONS = {
  "web-development": "🌐",
  "mobile-development": "📱",
  "data-science": "📊",
  "artificial-intelligence": "🤖", 
  "cybersecurity": "🔒",
  "cloud-computing": "☁️",
  "devops": "⚙️",
  "programming-fundamentals": "💻",
  "database": "🗄️",
  "ui-ux-design": "🎨",
  "game-development": "🎮",
  "blockchain": "⛓️"
};

export const getCategoryLabel = (categoryKey) => {
  return CATEGORIES[categoryKey] || categoryKey;
};

export const getCategoryIcon = (categoryKey) => {
  return CATEGORY_ICONS[categoryKey] || "📚";
};