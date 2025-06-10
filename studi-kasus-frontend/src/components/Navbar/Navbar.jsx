import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { selectTotalCartAmount } from '../../redux/slices/cartSlice';
import { selectAuthToken, userLogout } from '../../redux/slices/auth';
import { resetCart } from "../../redux/slices/cartSlice";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(selectAuthToken);
  const totalCartQty = useSelector(selectTotalCartAmount);

  const handleLogout = () => {
    dispatch(userLogout());
    dispatch(resetCart());
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/"><img src={assets.foodies} alt="logo" className="logo" /></Link>
      
      <ul className="navbar-menu">
        <a
          href="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" />
        
        <div className="navbar-search-icon">
          <Link to="/carts">
            <img src={assets.basket_icon} alt="cart" />
            {totalCartQty > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalCartQty}
              </span>
            )}
          </Link>
        </div>

        {token ? (
          <div className="navbar-user">
            <Link className="profile" to="/users">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
