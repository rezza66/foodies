import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom'
// import StoreContextProvider from './context/StoreContext.jsx'
// import { store } from "./redux/store";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/rootReducer.js";


const store = configureStore({
  reducer: rootReducer
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
