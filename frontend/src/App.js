import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from "./components/Home";
import Cart from "./components/Cart";

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart/:cartId" element={<Cart />} />
        </Routes>
      </Router>
    );
  }


export default App;
