import { fetchItems, addItemToCart, updateCartItem } from "../api/index";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Cart = () => {
    const { cartId } = useParams();
    const [items, setItems] = useState([]);
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

    getItems();
     }, []);

     const handleAddToCart = async (item) => {
        const newQty = (cart[item.code] || 0) + 1

        setCart(prev => ({
            ...prev,
            [item.id]: newQty
        }));
        console.log("DEBUG", cartId, item.code, newQty)
        try {
            await addItemToCart(cartId, item.code, newQty);
            console.log(`Added ${item.name} to cart`)
        } catch (error) {
            console.error("Failed to add to cart", error);
        }

     }

    const handleRemoveFromCart = async (item) => {
        const currentQty = (cart[item.code] || 0) - 1
        const newQty = Math.max(currentQty - 1, 0);

        if (newQty === 0 && currentQty === 0) return;

        console.log("DEBUG", cartId, item.code, newQty)
        setCart(prev => ({
            ...prev,
            [item.id]: newQty
        }));

        try {
            await updateCartItem(cartId, item.code, newQty);
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
                    <div class="item-name"> {item.name} </div>
                    {item.price}€ {item.quantity}
                    <button onClick={() => handleAddToCart(item)}>+</button>
                    <button onClick={() => handleRemoveFromCart(item)}>-</button>
                </div>
            ))}
         </div>
    );
};

export default Cart;
