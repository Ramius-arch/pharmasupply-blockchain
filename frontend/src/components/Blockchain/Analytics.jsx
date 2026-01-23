import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import './Analytics.css';

const Analytics = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  const transactionTypes = transactions.reduce((acc, tx) => {
    acc[tx.type] = (acc[tx.type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(transactionTypes).map(key => ({
    name: key,
    value: transactionTypes[key],
  }));

  const transactionsByDate = transactions.reduce((acc, tx) => {
    const date = new Date(tx.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const lineData = Object.keys(transactionsByDate).map(key => ({
    date: key,
    count: transactionsByDate[key],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="analytics-container">
      <h2>Transaction Analytics</h2>
      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Transactions</h3>
          <p>{transactions.length}</p>
        </div>
        <div className="summary-card">
          <h3>Transaction Types</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="summary-card">
          <h3>Transactions Over Time</h3>
          <LineChart width={600} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

