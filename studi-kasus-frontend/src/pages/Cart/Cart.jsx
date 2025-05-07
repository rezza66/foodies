import React from "react";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { removeCartItem } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Mengambil data cart dari Redux
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Menghitung total harga dari semua item dalam cart
  const getTotalCartAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id}>
              <div className="cart-items-title cart-items-item">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>${item.price.toFixed(2)}</p>
                <p>{item.qty}</p>
                <p>${(item.price * item.qty).toFixed(2)}</p>
                <p
                  onClick={() => dispatch(removeCartItem(item._id))}
                  className="cross"
                >
                  x
                </p>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p className="empty-cart">Your cart is empty</p>
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() > 0 ? 2.0 : 0.0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${(getTotalCartAmount() > 0 ? getTotalCartAmount() + 2 : 0).toFixed(2)}
              </b>
            </div>
          </div>
          <button
            onClick={() => navigate("/order")}
            disabled={getTotalCartAmount() === 0}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
