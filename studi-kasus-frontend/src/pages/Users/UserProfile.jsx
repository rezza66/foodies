import React from 'react';

const UserProfile = ({ user }) => {
  return (
    <div>
      <h3>Profile</h3>
      <p>Full Name: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;