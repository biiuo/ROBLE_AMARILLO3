import { apiRequest } from './cursos';

// Estadísticas del dashboard
export const apiGetDashboardStats = async () => {
  return await apiRequest('/admin/dashboard/stats');
};

// Gestión de usuarios
export const apiGetAllUsers = async () => {
  return await apiRequest('/admin/users');
};

export const apiCreateUser = async (userData) => {
  return await apiRequest('/admin/users', {
    method: 'POST',
    body: userData
  });
};

export const apiUpdateUser = async (userId, userData) => {
  return await apiRequest(`/admin/users/${userId}`, {
    method: 'PUT',
    body: userData
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
export const apiGetEnrollmentStats = async () => {
  return await apiRequest('/admin/stats/enrollments');
};