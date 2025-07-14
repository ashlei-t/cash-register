import { fetchItems, addItemToCart, updateCartItem, fetchCart } from "../api/index";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Cart = () => {
    const { cartId } = useParams();
    const [items, setItems] = useState([]);
    const [qty, setQty] = useState({});
    const [cart, setCart] = useState({});

    useEffect(() => {
        const getItems = async () => {
            try {
                const response = await fetchItems();
                console.log("response:",response);
                setItems(response.data);
            } catch (error) {
                console.error("Failed to fetch items", error);
            }
        }

        const getCart = async () => {
            try {
                const response = await fetchCart(cartId);
                setCart(response.data);
            } catch(error) {
                console.error("Error fetching cart:", error);
            }
        }
        getItems();
        if (cartId) getCart();
     }, [cartId]);

     const handleAddToCart = async (item) => {
        const newQty = (qty[item.code] || 0) + 1

        setQty(prev => ({
            ...prev,
            [item.id]: newQty
        }));
        console.log("DEBUG", cartId, item.code, newQty)
        try {
            await addItemToCart(cartId, item.code, newQty);
            const response = await fetchCart(cartId);
            setCart(response.data)
            console.log(`Added ${item.name} to cart`)
        } catch (error) {
            console.error("Failed to add to cart", error);
        }

     }

    const handleRemoveFromCart = async (item) => {
        const currentQty = (qty[item.code] || 0) - 1
        const newQty = Math.max(currentQty - 1, 0);

        if (newQty === 0 && currentQty === 0) return;

        console.log("DEBUG", cartId, item.code, newQty)
        setQty(prev => ({
            ...prev,
            [item.id]: newQty
        }));

        try {
            await updateCartItem(cartId, item.code, newQty);
            const response = await fetchCart(cartId);
            setCart(response.data);
            console.log("DEBUG",cart);
            console.log(`Added ${item.name} to cart`)
        } catch (error) {
            console.error("Failed to add to cart", error);
        }
    };

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
                </ul>
            </div>
         </div>
    );
};

export default Cart;
