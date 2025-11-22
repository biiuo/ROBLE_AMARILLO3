// api/upload.js
const BASE_URL = import.meta.env.VITE_API_URL|| import.meta.VITE_API_URL_LOCAL;
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

    const json = await response.json();
    // El backend responde { success: true, message: '', data: { imageUrl, publicId } }
    // Queremos devolver directamente el objeto con imageUrl/publicId para facilitar el uso.
    return { ok: true, data: json.data || json };
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