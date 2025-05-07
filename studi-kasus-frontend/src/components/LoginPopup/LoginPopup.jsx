import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../../redux/slices/auth'; // Sesuaikan path sesuai struktur proyek Anda
import { assets } from '../../assets/assets';
import './LoginPopup.css';
import { fetchCartItems } from '../../redux/slices/cartSlice';

const LoginPopup = ({ setShowLogin }) => {
  const dispatch = useDispatch();
  const [currState, setCurrState] = useState("Login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user'); // Default role

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currState === "Login") {
      try {
        const resultAction = await dispatch(loginUser({ email, password })).unwrap();
        if (resultAction) {
          dispatch(fetchCartItems()); 
        }
      } catch (error) {
        console.error("Login gagal:", error);
      }
    } else {
      dispatch(registerUser({ username, email, password, role }));
    }

    setShowLogin(false);
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <input
              type="text"
              placeholder="Your name"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {currState !== "Login" && (
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}
        </div>
        <button type="submit">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
