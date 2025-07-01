import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/StoreLandingPage.css';

const StoreHeader = ({ storeId }) => {
  const customerId = localStorage.getItem('customerId');
  const [cartCount, setCartCount] = useState(0);
  const [storeName, setStoreName] = useState('');


  useEffect(() => {
    if (!storeId) return;

    // Fetch store name
    axios.get(`http://localhost:5000/api/store/${storeId}`)
      .then(response => {
        setStoreName(response.data.store.store_name);
      })
      .catch(error => console.error('Error fetching store:', error));
      if (customerId) {
    axios.get(`http://localhost:5000/api/carts/${storeId}/${customerId}/items`)
      .then(response => {
        setCartCount(response.data.length);
      })
      .catch(err => {
        console.error('Error fetching cart items:', err);
        setCartCount(0);
      });
    }
  }, [storeId, customerId]);

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerId');
    localStorage.removeItem('storeId');
    window.location.href = `/store/${storeId}/login`; // Force redirect and state reset
  };

  return (
    <header className="store-header">
      <div className="nav-left">
        <Link to={`/store/${storeId}/shop`}>
          <i className="fas fa-store" style={{ marginRight: '8px' }}></i>
          Shop
        </Link>
        {customerId && (
          <Link to={`/store/${storeId}/shop/orders`} className="nav-link">
              <i className="fas fa-receipt" style={{ marginRight: '8px' }}></i>
               Orders
          </Link>
        )}
      </div>

      <Link to={`/store/${storeId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="store-title">{storeName}</div>
      </Link>

      <div className="nav-right">
        <Link to={`/store/${storeId}/shop/cart`}>
          <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i>
          Cart ({cartCount})
        </Link>

        {customerId && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default StoreHeader;
