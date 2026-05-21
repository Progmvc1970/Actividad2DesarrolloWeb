// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5001", // 🔹 sin /api porque tu backend no lo usa
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    switch (status) {
      case 400: alert("Solicitud inválida."); break;
      case 401:
        alert("Tu sesión ha expirado. Vuelve a iniciar sesión.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        break;
      case 403: alert("No tienes permisos para esta acción."); break;
      case 404: alert("Recurso no encontrado."); break;
      case 500: alert("Error interno del servidor."); break;
      default: alert("Error de conexión. Verifica tu backend.");
    }
    return Promise.reject(error);
  }
);

export default api;
