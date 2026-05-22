/**
 * cart.js - Funcionalidad principal para el carrito de la compra
 */

const CART_STORAGE_KEY = 'doces_e_mecos_cart';

// Obtener el carrito de sessionStorage
function getCart() {
    const cart = sessionStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

// Guardar el carrito en sessionStorage
function saveCart(cart) {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Añadir producto al carrito
function addToCart(product) {
    let cart = getCart();
    const existingProductIndex = cart.findIndex(item => String(item.id) === String(product.id));

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }

    saveCart(cart);
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => String(item.id) !== String(productId));
    saveCart(cart);
}

// Actualizar cantidad de un producto en el carrito
function updateQuantity(productId, delta) {
    let cart = getCart();
    // Convertimos ambos a String para evitar errores de tipo (number vs string)
    const productIndex = cart.findIndex(item => String(item.id) === String(productId));

    if (productIndex > -1) {
        cart[productIndex].quantity += delta;
        // No permitir cantidades menores a 1, si es 0 o menos se elimina
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }
        saveCart(cart);
    }
}

// Calcular el precio total
function calculateTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

