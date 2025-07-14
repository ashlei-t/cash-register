import './App.css';
import axios from 'axios'
import { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/items')
      .then(response => {
        setItems(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error("API Error:", error);
      });
  }, []);

  return (
      <div>
        <h1>Items</h1>
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} (${item.price})
            </li>
          ))}
        </ul>
      </div>
    );
  }


export default App;
