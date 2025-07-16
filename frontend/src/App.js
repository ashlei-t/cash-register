import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Start from "./components/Start";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/cart/:cartId" element={<Cart />} />
          <Route path="/checkout/:cartId" element={<Checkout />} />
        </Routes>
      </Router>
    );
  }


export default App;
