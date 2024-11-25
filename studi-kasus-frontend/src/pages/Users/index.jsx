import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import UserProfile from './UserProfile';
import UserOrders from './UserOrders';
import UserAddress from './UserAddress';

const UserPage = () => {
  const authState = useSelector((state) => state.auth || { user: null, orders: [], address: null });
  const { user, orders, address } = authState;
  const [activeContent, setActiveContent] = useState('profile');

  const renderContent = () => {
    switch (activeContent) {
      case 'profile':
        return <UserProfile user={user} />;
      case 'orders':
        return <UserOrders orders={orders} />;
      case 'address':
        return <UserAddress address={address} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <h2>User Page</h2>
      <nav className="mb-3">
        <button
          className={`btn ${activeContent === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveContent('profile')}
        >
          Profile
        </button>
        <button
          className={`btn ${activeContent === 'address' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveContent('address')}
        >
          Address
        </button>
        <button
          className={`btn ${activeContent === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveContent('orders')}
        >
          Orders
        </button>
      </nav>

      <div className="card">
        <div className="card-body">
          {user ? (
            renderContent()
          ) : (
            <p className="card-text">No user data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
