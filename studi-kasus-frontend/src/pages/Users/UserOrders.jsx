import React from 'react';

export const UserOrders = ({ orders }) => {
  return (
    <div>
      <h3>User Orders</h3>
      {orders.map(order => (
        <div key={order.id}>
          <p>Order ID: {order.id}</p>
          {/* Add more order information as needed */}
        </div>
      ))}
    </div>
  );
};
