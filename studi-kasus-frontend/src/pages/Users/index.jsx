// index.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/slices/userSlice";
import { fetchAddresses } from "../../redux/slices/addressSlice";
import { UserProfile } from "./UserProfile";
import { UserAddress } from "./UserAddress";
import { UserOrders } from "./UserOrders";

const UserPage = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const orders = useSelector((state) => state.auth.orders);
  // const addresses = useSelector((state) => state.address.addresses);
  const token = useSelector((state) => state.auth.token);
  const [activeContent, setActiveContent] = useState("profile");

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
      dispatch(fetchAddresses(token));
    }
  }, [dispatch, token]);

  const renderContent = () => {
    if (activeContent === "profile") {
      return userState.data ? <UserProfile user={userState.data} /> : <p>Loading user data...</p>;
    }
    if (activeContent === "address") {
      return <UserAddress />;
    }    
    if (activeContent === "orders") {
      return orders.length > 0 ? <UserOrders orders={orders} /> : <p>No orders found.</p>;
    }
    return null;
  };

  if (userState.loading) return <p>Loading...</p>;
  if (userState.error) return <p>Error: {userState.error}</p>;

  return (
    <div className="container mt-4">
      <h2>USER PAGE</h2>
      <nav className="mb-3">
        <button className={`btn mx-2 ${activeContent === "profile" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveContent("profile")}>
          Profile
        </button>
        <button className={`btn mx-2 ${activeContent === "address" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveContent("address")}>
          Address
        </button>
        <button className={`btn mx-2 ${activeContent === "orders" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveContent("orders")}>
          Orders
        </button>
      </nav>

      <div className="card">
        <div className="card-body">{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserPage;
