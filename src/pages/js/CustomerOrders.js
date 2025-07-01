import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/CustomerOrders.css';
import { useParams } from 'react-router-dom';
import StoreHeader from './StoreHeader.js';

const CustomerOrders = () => {
  const { storeId } = useParams();
  const customerId = localStorage.getItem('customerId');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/customer/${customerId}/store/${storeId}/orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Error fetching orders:', err));
  }, [storeId, customerId]);

  return (
    <div>  <StoreHeader storeId={storeId}  />
    <div className="orders-page">
  
<div className="orders-container-customer">
      <h2>Your Past Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order.order_id}>
            <h3>Order #{order.order_id}</h3>
            <p>Date: {new Date(order.date_ordered).toLocaleDateString()}</p>
            <p>Status: {order.status}</p>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div className="order-item" key={idx}>
                  <img src={`http://localhost:5000/${item.image_url}`} alt={item.product_name} />
                  <div>
                    <p><strong>{item.product_name}</strong></p>
                    <p>{item.quantity} × ₹{item.price}</p>
                    <p>Subtotal: ₹{Number(item.item_total).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <strong>Total: ₹{Number(order.total_amount).toFixed(2)}</strong>
            </div>
          </div>
        ))
      )}
    </div>
    </div>
    </div>
  );
};

export default CustomerOrders;
