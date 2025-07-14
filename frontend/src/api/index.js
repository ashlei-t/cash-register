import axios from "axios";

const BASE_URL = "http://localhost:3001";

// gets all the items that exist in product catalog
export const fetchItems = () => axios.get(`${BASE_URL}/items`);

// creates a new cart
export const createCart = () => axios.post(`${BASE_URL}/carts`);

// fetches an existing cart
export const fetchCart = (cartId) => axios.get(`${BASE_URL}/carts/${cartId}`);

// add an item to the cart
export const addItemToCart = (cartId, code, quantity) =>
    axios.post(`${BASE_URL}/cart_items`, {
        cart_id: cartId,
        code,
        quantity
    });

// updates quantity
export const updateCartItem = (cartId, code, quantity) =>
    axios.patch(`${BASE_URL}/cart_items`, {
    cart_id: cartId,
    code,
    quantity
  });
// deletes all items in a cart
export const clearCart = (cartId) =>
    axios.delete(`${BASE_URL}/carts/${cartId}/clear`);
// completes the checkout
export const checkoutCart = (cartId) =>
    axios.post(`${BASE_URL}/carts/${cartId}/checkout`);
