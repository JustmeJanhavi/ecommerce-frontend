import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Customer_Login.css';
import cus_login_img from '../../images/cus_login.jpg';
import axios from 'axios';

function Customer_Login() {
  const [cusEmail, setCusEmail] = useState('');
  const [cusPassword, setCusPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { storeId } = useParams(); // ✅ Get store ID from URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cusEmail || !cusPassword) {
      setError('Please enter both email and password.');
      return;
    }

    if (!cusEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/customer/auth/login`, {
        email: cusEmail,
        password: cusPassword,
        store_id: storeId // ✅ Send store_id to backend
      });

      // ✅ Store token & customerId
      localStorage.setItem('customerToken', res.data.token);
      localStorage.setItem('customerId', res.data.user.id);
      localStorage.setItem('storeId', res.data.user.storeId);

      navigate(`/store/${storeId}`); // ✅ Redirect to StoreLandingPage
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="login-wrapper-cus">
      <div className="login-box">
        {/* LEFT - Image */}
        <div className="login-image-section">
          <img src={cus_login_img} alt="Login" />
        </div>

        {/* RIGHT - Form */}
        <div className="login-form-section">
          <div className="login-form-content">
            <h2>Sign In</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={cusEmail}
                onChange={(e) => setCusEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={cusPassword}
                onChange={(e) => setCusPassword(e.target.value)}
              />

              {error && <p className="error-msg">{error}</p>}

              <button type="submit">Login</button>
            </form>

            <p className="signup-text">
              Don’t have an account?{' '}
              <span onClick={() => navigate(`/store/${storeId}/signup`)}>Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customer_Login;
