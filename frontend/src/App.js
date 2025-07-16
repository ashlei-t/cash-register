import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from "./components/Home";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart/:cartId" element={<Cart />} />
          <Route path="/checkout/:cartId" element={<Checkout />} />
        </Routes>
      </Router>
    );
  }


export default App;
