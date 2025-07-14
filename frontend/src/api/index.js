import axios from "axios";

const BASE_URL = "http://localhost:3001";

// gets all the items that exist in product catalog
export const fetchItems = () => axios.get(`${BASE_URL}/items`);

// creates a new cart
export const createCart = () => axios.post(`${BASE_URL}/carts`);

// fetches an existing cart
export const fetchCart = (id) => axios.get(`${BASE_URL}/carts/${id}`);

// add an item to the cart
export const addItemToCart = (cartId, code, quantity) =>
    axios.post(`${BASE_URL}/cart_items`, {
        cart_id: cartId,
        code,
        quantity
    });

// updates quantity
export const updateCartItem = (id, quantity) =>
    axios.patch(`${BASE_URL}/cart_items/${id}`, {quantity});
// deletes all items in a cart
export const clearCart = (id) =>
    axios.delete(`${BASE_URL}/carts/${id}/clear`);
// completes the checkout
export const checkoutCart = (id) =>
    axios.post(`${BASE_URL}/carts/${id}/checkout`);
