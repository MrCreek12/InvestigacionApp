// investigacionapp.client/src/services/boxService.js

const BOX_STORAGE_KEY = 'user_box';
    
// Obtener piezas del box desde localStorage
export const getBoxItems = () => {
    try {
        const boxData = localStorage.getItem(BOX_STORAGE_KEY);
        return boxData ? JSON.parse(boxData) : [];
    } catch (error) {
        console.error('Error al obtener items del box:', error);
        return [];
    }
};

// Guardar piezas del box en localStorage
const saveBoxItems = (items) => {
    try {
        localStorage.setItem(BOX_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Error al guardar items del box:', error);
    }
};

// Agregar pieza al box
export const addToBox = (pieza, cantidadSolicitada = 1) => {
    const boxItems = getBoxItems();
    
    // Verificar si la pieza ya está en el box
    const existingItemIndex = boxItems.findIndex(item => item.pieza.id === pieza.id);
    
    if (existingItemIndex >= 0) {
        // Si ya existe, actualizar la cantidad solicitada
        boxItems[existingItemIndex].cantidadSolicitada += cantidadSolicitada;
    } else {
        // Si no existe, agregar nueva entrada
        const boxItem = {
            pieza: pieza,
            cantidadSolicitada: cantidadSolicitada,
            fechaAgregada: new Date().toISOString()
        };
        boxItems.push(boxItem);
    }
    
    saveBoxItems(boxItems);
    return boxItems;
};

// Remover pieza del box
export const removeFromBox = (piezaId) => {
    const boxItems = getBoxItems();
    const updatedItems = boxItems.filter(item => item.pieza.id !== piezaId);
    saveBoxItems(updatedItems);
    return updatedItems;
};

// Actualizar cantidad solicitada de una pieza en el box
export const updateBoxItemQuantity = (piezaId, nuevaCantidad) => {
    const boxItems = getBoxItems();
    const itemIndex = boxItems.findIndex(item => item.pieza.id === piezaId);
    
    if (itemIndex >= 0) {
        if (nuevaCantidad <= 0) {
            // Si la cantidad es 0 o menor, remover el item
            return removeFromBox(piezaId);
        } else {
            boxItems[itemIndex].cantidadSolicitada = nuevaCantidad;
            saveBoxItems(boxItems);
        }
    }
    
    return boxItems;
};

// Limpiar todo el box
export const clearBox = () => {
    localStorage.removeItem(BOX_STORAGE_KEY);
    return [];
};

// Obtener el número total de items en el box
export const getBoxItemCount = () => {
    const boxItems = getBoxItems();
    return boxItems.reduce((total, item) => total + item.cantidadSolicitada, 0);
};

// Verificar si una pieza está en el box
export const isInBox = (piezaId) => {
    const boxItems = getBoxItems();
    return boxItems.some(item => item.pieza.id === piezaId);
};