import { createCart } from "../api/index";
import { useNavigate } from "react-router";
import { useState } from "react";

const Home = () => {
    const navigate = useNavigate();
    const [setCartId] = useState();

    const handleStart = async () => {
        try {
            const response = await createCart();
            const newCartId = response.data.id
            setCartId(newCartId);
            navigate(`/cart/${newCartId}`);
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

export default Home;
