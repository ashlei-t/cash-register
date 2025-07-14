import { fetchItems, updateCartItem, fetchCart, clearCart, addItemToCart, removeCartItem } from "../api/index";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Cart = () => {
    const { cartId } = useParams();
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState({});

    useEffect(() => {
        // gets all items from product catalog
        const getItems = async () => {
            try {
                const response = await fetchItems();
                console.log("getItems", response.data);
                setItems(response.data);
            } catch (error) {
                console.error("Failed to fetch items", error);
            }
        }

        // gets the cart and lists the items
        const getCart = async () => {
            try {
                const response = await fetchCart(cartId);
                console.log("getCart", response.data);
                setCart(response.data);
            } catch(error) {
                console.error("Error fetching cart:", error);
            }
        }

        getItems();
        if (cartId) getCart();
     }, [cartId]);

     const getCurrentQty = (itemCode) => {
        const cartItems = cart.items || [];
        const cartItem = cartItems.find(ci => ci.code === itemCode);
        return cartItem ? cartItem.quantity : 0;
     };

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

            const response = await fetchCart(cartId);
            setCart(response.data)
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

            const response = await fetchCart(cartId);
            setCart(response.data);

        } catch (error) {
            console.error("Failed to update cart", error);
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart(cartId);
            const response = await fetchCart(cartId);
            setCart(response.data);
        } catch(error) {
            console.error("Error fetching cart:", error);
        }
    }


    return (
        <div>
            <h1>Coffee House!</h1>
            {items.map(item => (
                <div key={item.id}>
                    <div className="item-name"> {item.name} </div>
                    {item.price}€ {item.quantity}
                    <button onClick={() => handleAddToCart(item)}>+</button>
                    <button onClick={() => handleRemoveFromCart(item)}>-</button>
                </div>
            ))}
            <div>
                <ul>
                    <h2>Cart Summary</h2>
                    {cart.items?.map(ci => (
                        <li key={ci.id}>{ci.name} {ci.price} x {ci.quantity}</li>
                    ))}
                    <button onClick={handleClearCart}>clear</button>
                </ul>
            </div>
         </div>
    );
};

export default Cart;
