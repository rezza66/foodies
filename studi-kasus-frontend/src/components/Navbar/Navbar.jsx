import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { selectTotalCartAmount } from '../../redux/slices/cartSlice';
import { selectAuthToken, userLogout } from '../../redux/slices/auth'; // Import untuk token dan action logout

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const dispatch = useDispatch();

  // Menggunakan selektor untuk mendapatkan jumlah total item di keranjang
  const totalCartAmount = useSelector(selectTotalCartAmount);

  // Memeriksa apakah token ada (artinya user sudah login)
  const token = useSelector(selectAuthToken);

  const handleLogout = () => {
    dispatch(userLogout());
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
          <Link to='/carts'><img src={assets.basket_icon} alt="..." /></Link>         
          <div className={totalCartAmount === 0 ? "" : "dot"}></div>
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
