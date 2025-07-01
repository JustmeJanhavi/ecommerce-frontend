import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/cartPage.css';
import StoreHeader from './StoreHeader.js';

const CartPage = () => {
  const { storeId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const customerId = localStorage.getItem('customerId');
  const [storeName, setStoreName] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  // ✅ Extract to reusable function
  const fetchCartItems = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/carts/${storeId}/${customerId}/items`)
      .then((response) => setCartItems(response.data))
      .catch((err) => console.error('Error fetching cart:', err));
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/store/${storeId}`)
      .then((response) => setStoreName(response.data.store.store_name))
      .catch((error) => console.error('Error fetching store:', error));

    fetchCartItems(); // Initial load
  }, [storeId]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/cart-items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      fetchCartItems(); // ✅ Refresh after update
    } catch (err) {
      console.error('Error updating quantity', err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/cart-items/${itemId}`, {
        method: 'DELETE',
      });
      fetchCartItems(); // ✅ Refresh after removal
    } catch (err) {
      console.error('Error removing item', err);
    }
  };

  const handleCheckout = async () => {
    try {
      const orderPayload = {
        customer_id: customerId,
        store_id: storeId,
        total_amount: subtotal,
        status: 'pending',
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/cart/orders`, orderPayload);
      setShowDialog(true);
      setCartItems([]); // clear UI cart
    } catch (err) {
      console.error('Error placing order:', err);
    }
  };

  return (
    <div>
      <StoreHeader
        storeId={storeId}
        storeName={storeName}
        cartCount={cartItems.length}
      />

<div className="cart-page">
  <h2>Cart</h2>
  {cartItems.length === 0 ? (
  <div className="empty-cart">
    <h2>Your cart is empty 🛒</h2>
    <button className="continue-button" onClick={() => window.location.href = `/store/${storeId}/shop`}>
      Continue Shopping
    </button>
  </div>
) : (
  <div className="cart-container">
    <div className="cart-items">
      {cartItems.map((item) => (
        <div className="cart-item" key={item.item_id}>
          <img src={`${process.env.REACT_APP_STATIC_URL}/${item.image_url}`} alt={item.name} />
          <div className="item-info">
            <p>{item.name}</p>
            <p>Price: ₹{Number(item.price).toFixed(2)}</p>
            <p>Total: ₹{Number((item.price * item.quantity).toFixed(2))}</p>
          </div>
          <div className="quantity-controls">
            <button onClick={() => updateQuantity(item.item_id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.item_id, item.quantity + 1)}>+</button>
          </div>
          <button className="remove-item" onClick={() => removeItem(item.item_id)}>🗑️</button>
        </div>
      ))}
    </div>

    <div className="cart-summary">
      <h3>Summary</h3>
      <p>{cartItems.length} Item(s)</p>
      <p>Total: ₹{Number(subtotal.toFixed(2))}</p>
      <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
    </div>
  </div>

  
)}
</div>
{showDialog && (
  <div className="dialog-overlay">
    <div className="dialog-box">
      <button className="close-btn" onClick={() => setShowDialog(false)}>×</button>
      <h3>🎉 Your order has been placed!</h3>
      <p>Thank you for shopping with us.</p>
      <button
        className="continue-button"
        onClick={() => {
          setShowDialog(false);
          window.location.href = `/store/${storeId}/shop`;
        }}
      >
        Continue Shopping
      </button>
    </div>
  </div>
)}

</div>
    
    );
  };

export default CartPage;
