import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useSelector, useDispatch } from 'react-redux';
import { selectTotalCartAmount } from '../../redux/slices/cartSlice';
import { selectAuthToken, userLogout } from '../../redux/slices/auth';
import { resetCart } from "../../redux/slices/cartSlice";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const totalCartAmount = useSelector(selectTotalCartAmount);
  const token = useSelector(selectAuthToken);
  
  const cartCount = useSelector((state) =>
    (state.cart.cartItems || []).reduce(
      (total, item) => total + (item.qty || 0),
      0
    )
  );

  const handleLogout = () => {
    dispatch(userLogout());
    dispatch(resetCart());
    navigate("/"); // Redirect ke halaman home setelah logout
  };

  return (
    <div className="navbar">
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>     
      <ul className="navbar-menu">
        <a href="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/carts'>
            <img src={assets.basket_icon} alt="..." />
            {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{cartCount}</span>} {/* Menampilkan badge jika ada item di cart */}
          </Link>         
        </div>
        
        {token ? (
          <div className="navbar-user">
            <Link className="profile" to='/users'>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
