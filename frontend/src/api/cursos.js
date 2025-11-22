
const BASE_URL = import.meta.env.VITE_API_URL|| import.meta.VITE_API_URL_LOCAL;

// Helper para requests JSON
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: data.error || `Error ${response.status}`,
        status: response.status
      };
    }

    return {
      ok: true,
      data,
      status: response.status
    };
  } catch (error) {
    console.error("❌ Error en apiRequest:", error.message);
    return {
      ok: false,
      error: 'Error de conexión. Intenta nuevamente.',
      status: 0
    };
  }
};

// CURSOS

export const apiGetCourses = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  console.log("📦 Cursos:", queryParams);
  return await apiRequest(`/course/getcourses${queryParams ? `?${queryParams}` : ''}`);
};


export const apiGetAllCourses = async () => {
  return await apiRequest('/course/admin/all-courses');
};

export const apiGetCourse = async (courseId) => {
  return await apiRequest(`/course/${courseId}`);
};

export const apiGetMyCourses = async () => {
  return await apiRequest('/course/my-courses');
};

export const apiEnrollCourse = async (courseId) => {
  return await apiRequest(`/course/enroll/${courseId}`, {
    method: 'POST'
  });
};

// Crear curso con FormData
const objectToFormData = (obj) => {
  const fd = new FormData();
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val === undefined || val === null) return;
    if (typeof val === 'object' && !(val instanceof File) && !(val instanceof Blob)) {
      fd.append(key, JSON.stringify(val));
    } else {
      fd.append(key, val);
    }
  });
  return fd;
};

export const apiCreateCourse = async (data) => {
  const token = localStorage.getItem('token');
  try {
    const body = data instanceof FormData ? data : objectToFormData(data);

    const response = await fetch(`${BASE_URL}/course/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body
    });

    const respData = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: respData.error || `Error ${response.status}`
      };
    }

    return {
      ok: true,
      data: respData
    };
  } catch (error) {
    return {
      ok: false,
      error: `Error de conexión al crear curso + ${error.message}`
    };
  }
};

// Actualizar curso con FormData
export const apiUpdateCourse = async (courseId, data) => {
  const token = localStorage.getItem('token');
  try {
    const body = data instanceof FormData ? data : objectToFormData(data);

    const response = await fetch(`${BASE_URL}/course/update/${courseId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body
    });

    const respData = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: respData.error || `Error ${response.status}`
      };
    }

    return {
      ok: true,
      data: respData
    };
  } catch (error) {
    return {
      ok: false,
      error: 'Error de conexión al actualizar curso' + error.message
    };
  }
};

export const apiDeleteCourse = async (courseId) => {
  return await apiRequest(`/course/${courseId}`, {
    method: 'DELETE'
  });
};

export const apiUpdateProgress = async (enrollmentId, progress) => {
  return await apiRequest(`/course/progress/${enrollmentId}`, {
    method: 'PUT',
    body: { progress }
  });
};

// USUARIOS
export const apiRegister = async (userData) => {
  return await apiRequest('/user/register', {
    method: 'POST',
    body: userData
  });
};

export const apiLogin = async (credentials) => {
  return await apiRequest('/user/login', {
    method: 'POST',
    body: credentials
  });
};

export const apiUpdateUser = async (userData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const identifier = user?.username || user?.email;
  return await apiRequest(`/user/update/${identifier}`, {
    method: 'PUT',
    body: userData
  });
};

export const apiDeleteUser = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const identifier = user?.username || user?.email;
  return await apiRequest(`/user/delete/${identifier}`, {
    method: 'DELETE'
  });
};

export { apiRequest };