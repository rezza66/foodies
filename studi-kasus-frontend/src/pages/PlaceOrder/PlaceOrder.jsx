import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getAddress } from "../../api/address";

const PlaceOrder = () => {
  const [addresses, setAddresses] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [error, setError] = useState(null);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const foodList = useSelector((state) => state.products.foodList);

  const token = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth")).token
    : null;

  useEffect(() => {
    if (token) {
      fetchAddresses();
    } else {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "No token found. Please log in again.",
      });
    }
  }, [token]);

  const fetchAddresses = async () => {
    try {
      setFetchStatus("loading");
      const response = await getAddress(token);
      if (response && Array.isArray(response)) {
        setAddresses(response);
        setFetchStatus("succeeded");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setFetchStatus("failed");
      setError("Failed to fetch addresses!");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch addresses!",
      });
    }
  };
  
  // Gunakan useMemo untuk menghitung ulang hanya ketika cartItems atau foodList berubah
  const totalCartAmount = useMemo(() => {
    let totalAmount = 0;

    if (cartItems && foodList) {
      for (const itemId in cartItems) {
        if (cartItems[itemId] > 0) {
          const product = foodList.find((food) => food._id === itemId);
          if (product) {
            totalAmount += product.price * cartItems[itemId];
          }
        }
      }
    }

    return totalAmount;
  }, [cartItems, foodList]);

  if (fetchStatus === "loading") return <div>Loading...</div>;
  if (fetchStatus === "failed") return <div>Error: {error}</div>;

  return (
    <form className="place-order">
      <div className="place-order-left">
        <h2 className="title">Delivery Information</h2>
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <div key={index} className="address-card">
              <p><strong>Full Name:</strong> {address.user.username}</p>
              <p><strong>Email:</strong> {address.user.email}</p>
              <p><strong>Address:</strong> {address.detail}</p>
              <p><strong>Province:</strong> {address.provinsi}</p>
              <p><strong>Kabupaten:</strong> {address.kabupaten}</p>
              <p><strong>Kecamatan:</strong> {address.kecamatan}</p>
              <p><strong>Kelurahan:</strong> {address.kelurahan}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>No addresses available</p>
        )}
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${totalCartAmount}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${totalCartAmount === 0 ? 0 : 2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>${totalCartAmount === 0 ? 0 : totalCartAmount + 2}</b>
          </div>
          <button type="submit" disabled={totalCartAmount === 0}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
