import { createCart } from "../api/index";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Start = () => {
    const navigate = useNavigate();
    const [cartId, setCartId] = useState();

    const handleStart = async () => {
        try {
            const response = await createCart();
            const newCartId = response.data.id
            setCartId(newCartId);
            console.log("Cart created with ID:", newCartId);
            
            navigate(`/cart/${cartId}`);
        } catch (error) {
            console.error("Failed to start error", error);
        }
    }
    return (
        <div>
            <h1>Coffee House!</h1>
            <button onClick={handleStart}>Start</button>
        </div>
    );
};

export default Start;
