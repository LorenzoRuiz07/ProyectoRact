import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productos';

// Nota que usamos 'export const' en todas
export const obtenerProductos = async () => {
    try {
        const respuesta = await axios.get(API_URL);
        return respuesta.data;
    } catch (error) {
        console.error("Error al cargar productos:", error);
        return [];
    }
};

export const crearProducto = async (producto) => {
    try {
        const respuesta = await axios.post(API_URL, producto);
        return respuesta.data;
    } catch (error) {
        console.error("Error al crear:", error);
        return null;
    }
};

export const eliminarProducto = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return true;
    } catch (error) {
        console.error("Error al eliminar:", error);
        return false;
    }
};

// Obtener un solo producto por ID
export const obtenerProductoPorId = async (id) => {
    try {
        const respuesta = await axios.get(`${API_URL}/${id}`);
        return respuesta.data;
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        return null;
    }
};