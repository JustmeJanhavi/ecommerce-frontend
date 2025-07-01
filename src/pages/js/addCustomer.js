import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/addCustomer.css';
import cusImage from '../../images/customers.jpg';
const AddCustomer = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    customer_name: '',
    email: '',
    phone_number: '',
    address: '',
    password: ''
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/customers/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(customer)
      });

      const data = await response.json(); // <-- Capture backend message

      if (!response.ok) throw new Error('Failed');
      navigate('/AdminOverview', { state: { tab: 'Customers' } })
    } catch (err) {
      alert('Error adding customer');
    }
  };

  return (
    <div className="add-customer-wrapper">
      <div className="add-customer-card">
        <div className="left-section">
          <button className="back-btn" onClick={() => navigate('/AdminOverview', { state: { tab: 'Customers' } })}>←</button>
          
          <div className="image-preview">
  <img src={cusImage} alt="Customer Image" className="home-image" />
  

            <p>Customer Photo</p>
          </div>
        </div>

        <div className="right-section">
          <div className="header-actions">
            <button className="cancel-btn" onClick={() => navigate('/AdminOverview', { state: { tab: 'Customers' } })}>Cancel</button>
            <button className="save-btn" onClick={handleSubmit}>Save</button>
          </div>

          <form className="form-body">
            <input
              type="text"
              name="customer_name"
              placeholder="Customer Name"
              value={customer.customer_name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={customer.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone_number"
              placeholder="Phone Number"
              value={customer.phone_number}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={customer.address}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={customer.password}
              onChange={handleChange}
              required
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
