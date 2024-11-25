import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { userLogin } from '../../redux/slices/auth'; // Sesuaikan path sesuai struktur proyek Anda
import { assets } from '../../assets/assets';
import './LoginPopup.css';

const LoginPopup = ({ setShowLogin }) => {
  const dispatch = useDispatch();
  const [currState, setCurrState] = useState("Login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user'); // Default role

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (currState === "Login") {
        response = await axios.post('http://localhost:5000/auth/login', { email, password });
      } else {
        response = await axios.post('http://localhost:5000/auth/register', { username, email, password, role });
      }

      const data = response.data;
      // console.log('Login response data:', data);

      dispatch(userLogin({ user: data, token: data.token }));
      setShowLogin(false);
    } catch (error) {
      console.error('Error:', error);
    }
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
