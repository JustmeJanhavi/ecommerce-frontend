import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/overview.css';
//npm install recharts
//npm install recharts chart.js react-chartjs-2
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const COLORS = ['#4B9FE1', '#69C2B0', '#FFD166', '#FF8C94', '#A29BFE', '#A3CEDC'];


const Overview = () => {
  const [data, setData] = useState({
    orders: 0,
    productsSold: 0,
    customers: 0,
    revenue: 0,
    topProducts: [],
    pendingOrders: [],
    orderStatusData: [],
    dailyRevenue: []
  });

  const storeId = localStorage.getItem('storeId');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        if (!storeId) {
          console.warn('No storeId found in localStorage');
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/stats/overview/${storeId}`);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching overview:', err);
      }
    };

    fetchOverview();
  }, [storeId]);

  return (
    <div className="overview-container">
      <h2>📊 Shop Overview</h2>

      {/* Stat Cards */}
      <div className="overview-cards">
        <div className="card">🛒 Orders: <strong>{data.orders}</strong></div>
        <div className="card">📦 Products Sold: <strong>{data.productsSold}</strong></div>
        <div className="card">👥 Customers: <strong>{data.customers}</strong></div>
        <div className="card">💰 Revenue: ₹<strong>{Number(data.revenue || 0).toFixed(2)}</strong></div>
      </div>

      {/* Charts Side by Side */}
<div className="charts-row">
  {/* Pie Chart for Order Status */}
  {data.orderStatusData.length > 0 && (
    <div className="chart-box">
      <h3>📌 Order Status</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data.orderStatusData}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.orderStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}

  {/* Line Chart for Daily Revenue */}
  {data.dailyRevenue.length > 0 && (
    <div className="chart-box">
      <h3>📈 Daily Revenue</h3>
      <ResponsiveContainer width="100%" height={280}>
<LineChart
  data={data.dailyRevenue}
  margin={{ top: 50, right: 30, left: 20, bottom: 30 }} // 👈 More space
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis domain={['auto', 'auto']} />
  <Tooltip />
  <Legend verticalAlign="top" height={36} />
  <Line type="monotone" dataKey="revenue" stroke="#4B9FE1" strokeWidth={2} />
</LineChart>
      </ResponsiveContainer>
    </div>
  )}
</div>

{/* Top Products List */}
{data.topProducts.length > 0 && (
  <div className="section">
    <h3>🏆 Top Selling Products</h3>
    <ul>
      {data.topProducts.map((product, index) => (
        <li key={index}>
          {product.product_name} — {product.sold} pcs
        </li>
      ))}
    </ul>
  </div>
)}


      {/* Pending Orders */}
      <div className="section">
        <h3>🕓 Pending Orders</h3>
        {data.pendingOrders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.pendingOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.order_id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.status}</td>
                  <td>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pending orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Overview;
