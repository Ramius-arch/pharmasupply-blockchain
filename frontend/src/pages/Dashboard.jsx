import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';

// Placeholder data for demonstration
const products = [
  { id: 1, name: 'Product A', price: 20 },
  { id: 2, name: 'Product B', price: 35 },
  { id: 3, name: 'Product C', price: 15 },
];

function Dashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Welcome message */}
        <Card title="Welcome!" withShadow>
          <p className="text-gray-700">Hello, welcome to your dashboard!</p>
          <Button variant="secondary" size="md">View Profile</Button>
        </Card>

        {/* Products overview */}
        <Card title="Products Overview" withShadow className="md:col-span-2">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    <Button size="sm">View</Button>
                    <Button variant="danger" size="sm">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Recent activity */}
        <Alert message="You have 3 new notifications." type="warning"></Alert>
      </div>
    </div>
  );
}

export default Dashboard;
