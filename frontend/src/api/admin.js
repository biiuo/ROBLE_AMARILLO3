import { apiRequest } from './cursos';

const BASE_URL = import.meta.env.VITE_API_URL|| 'http://localhost:5000';

// Estadísticas del dashboard
export const apiGetDashboardStats = async () => {
  const result = await apiRequest('/admin/dashboard/stats');
  console.log('Dashboard Stats:', result);
  return result;
};

// Gestión de usuarios
export const apiGetAllUsers = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return await apiRequest(`/admin/users${queryParams ? `?${queryParams}` : ''}`);
};

export const apiCreateUser = async (userData) => {
  return await apiRequest('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const apiUpdateUser = async (userId, userData) => {
  return await apiRequest(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
};

export const apiDeleteUser = async (userId) => {
  return await apiRequest(`/admin/users/${userId}`, {
    method: 'DELETE'
  });
};

// Inscripciones de cursos
export const apiGetCourseEnrollments = async (courseId) => {
  return await apiRequest(`/admin/courses/${courseId}/enrollments`);
};

// Reportes
export const apiGetEnrollmentStats = async (timeRange = 'month') => {
  return await apiRequest(`/admin/stats/enrollments?timeRange=${timeRange}`);
};

export const apiGetUserEnrollments = async () => {
  try {
    const response = await fetch('/admin/user-enrollments', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) throw new Error('Error fetching enrollments');
    const data = await response.json();
    
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};