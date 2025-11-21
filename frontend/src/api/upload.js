// api/upload.js
const BASE_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
export const apiUploadImage = async (file) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // No Content-Type para FormData, el browser lo setea automáticamente
      },
      body: formData
    });
    console.log('Upload Image Response:', response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error subiendo imagen');
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const apiDeleteImage = async (publicId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/upload/image`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error eliminando imagen');
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};