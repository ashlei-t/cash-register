import { fetchItems, updateCartItem, fetchCart, clearCart, addItemToCart, removeCartItem } from "../api/index";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import '../App.css'

const Cart = () => {
    const { cartId } = useParams();
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState({ items: [], total: 0});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // loads the cart and items
        const loadCart = async () => {
            try {
                setLoading(true);
                const [ itemsResponse, cartResponse ] = await Promise.all([
                    fetchItems(),
                    fetchCart(cartId)
                ])

                setItems(itemsResponse.data);
                console.log(itemsResponse.data);
                setCart(cartResponse.data);

                console.log("updated cart", cart);
                console.log("items", items);
            } catch (error) {
                console.error("Failed to fetch items", error);
            } finally {
                setLoading(false);
            }
        }

        if (cartId) {
            loadCart();
        }

     }, [cartId]);

     const getCurrentQty = (itemCode) => {
        const cartItems = cart.items || [];
        const cartItem = cartItems.find(ci => ci.code === itemCode);
        return cartItem ? cartItem.quantity : 0;
     };

    const getSubtotal = (itemCode) => {
        const cartItems = cart.items || [];
        const cartItem = cartItems.find(ci => ci.code === itemCode);
        return cartItem ? cartItem.price : 0;
     };

     const updateCartState = async () => {
        try {
            const response = await fetchCart(cartId);
            setCart(response.data);
        } catch (error) {
            console.error("Failed to update cart state", error);
        }
     }

     const handleAddToCart = async (item) => {
        const currentQty = getCurrentQty(item.code);
        const newQty = currentQty + 1;

        console.log("Adding to Cart:", cartId, item.code, newQty)

        try {
            if (currentQty === 0) {
                await addItemToCart(cartId, item.code, newQty);
            } else {
                await updateCartItem(cartId, item.code, newQty);
            }

            await updateCartState();

        } catch (error) {
            console.error("Failed to add to cart", error);
        }

     }

    const handleRemoveFromCart = async (item) => {
        const currentQty = getCurrentQty(item.code);

        if (currentQty === 0) return;

        const newQty = currentQty - 1 ;

        console.log("Removing from Cart:", cartId, item.code, newQty);

        try {
            if (newQty === 0) {
                await removeCartItem(cartId, item.code);
            } else {
                await updateCartItem(cartId, item.code, newQty);
            }

            updateCartState();

        } catch (error) {
            console.error("Failed to update cart", error);
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart(cartId);
            updateCartState();

        } catch(error) {
            console.error("Error fetching cart:", error);
        }
    }




    return (
        <div className="container mt-5">
            <h1 className="mb-4">Coffee House!</h1>

            <div className="mb-5">
            {items.map(item => {
            const enrichedItem = cart.subtotal?.items?.find(ci => ci.code === item.code);
            const discount = enrichedItem?.discount_applied || null;

            return (
                <div key={item.code || item.id} className="card mb-3">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                    <h5 className="card-title mb-1">{item.name}</h5>
                    <p className="mb-0">€{parseFloat(item.price).toFixed(2) }</p>
                    </div>

                    <div className="btn-group" role="group" aria-label="Quantity controls">
                    <button className="btn btn-outline-secondary" onClick={() => handleRemoveFromCart(item)}>-</button>
                    <span className="btn btn-light disabled">{getCurrentQty(item.code)}</span>
                    <button className="btn btn-outline-secondary" onClick={() => handleAddToCart(item)}>+</button>
                    </div>
                </div>

                <div className="mt-2 ms-3">
                    {discount && <span className="text-success">{discount}</span>}
                </div>
                </div>
            );
            })}
            </div>

            <div className="card">
            <div className="card-body">
                <h4 className="card-title">Cart Summary</h4>
                <ul className="list-group list-group-flush mb-3">
                {cart.items?.map(ci => (
                    <li key={ci.code || ci.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{ci.name} × {ci.quantity}</span>
                    <span>€{(ci.subtotal)}</span>
                    </li>
                ))}
                </ul>

                {cart.discounts && (
                <p className="text-muted">Discounts: {cart.discounts}</p>
                )}

                <h5>Total: €{cart.total}</h5>

                <button className="btn btn-danger mt-3" onClick={handleClearCart}>Clear Cart</button>
            </div>
            </div>
        </div>
    );
};

export default Cart
