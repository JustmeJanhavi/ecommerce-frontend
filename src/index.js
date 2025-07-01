import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/js/Home';
import Login from "./pages/js/login";
import SignUp from "./pages/js/signup";
import AdminOverview from './pages/js/admin-overview';
import AddOrder from './pages/js/addOrders';
import AddProduct from './pages/js/addProducts';
import AddCustomer from './pages/js/addCustomer';
import reportWebVitals from './reportWebVitals';
import StoreLandingPage from './pages/js/StoreLandingPage';
import ShopPageWrapper from './pages/js/ShopPage';
import CartPage from './pages/js/cartPage';
import CustomerLogin from './pages/js/Customer_Login';
import CustomerSignup from './pages/js/Customer_Signup';
import ProtectedRoute from './pages/js/ProtectedRoute';
import CustomerOrders from './pages/js/CustomerOrders';
import ProtectedAdminRoute from './pages/js/ProtectedAdminRoute';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
         <Route path="/addorder" element={<ProtectedAdminRoute><AddOrder /></ProtectedAdminRoute>} />
        <Route path="/add-product" element={<ProtectedAdminRoute><AddProduct /></ProtectedAdminRoute>} />
        <Route path="/addcustomer" element={<ProtectedAdminRoute><AddCustomer /></ProtectedAdminRoute>} />
        <Route path="/AdminOverview" element={<ProtectedAdminRoute><AdminOverview /></ProtectedAdminRoute>} />
        <Route path="/store/:storeId/login" element={<CustomerLogin />} />
        <Route path="/store/:storeId/signup" element={<CustomerSignup />} />
        {/* <Route path="/store/:storeId" element={<StoreLandingPage />} /> */}
        {/* <Route path="/store/:storeId/shop" element={<ShopPageWrapper />} /> */}
        {/* <Route path="/store/:storeId/shop/cart" element={<CartPage />} /> */}
        {/* ✅ These routes are now protected */}
<Route
  path="/store/:storeId"
  element={
    // <ProtectedRoute>
      <StoreLandingPage />
    // </ProtectedRoute>
  }
/>
<Route
  path="/store/:storeId/shop"
  element={
    // <ProtectedRoute>
      <ShopPageWrapper />
    // </ProtectedRoute>
  }
/>
<Route
  path="/store/:storeId/shop/cart"
  element={
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/store/:storeId/shop/orders"
  element={
    <ProtectedRoute>
      <CustomerOrders />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();
