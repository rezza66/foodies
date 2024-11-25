import React from "react";
import { assets } from "../../assets/assets";
import "./FoodItem.css";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/slices/cartSlice';

const FoodItem = ({ id, name, price, description, image }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleAddToCart = () => {
    dispatch(addToCart(id));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img src={image} alt="..." className="food-item-image" />
        {!cartItems[id] ? (
          <img className="add" onClick={handleAddToCart} src={assets.add_icon_white} alt="..." />
        ) : (
          <div className="food-item-counter">
            <img onClick={handleRemoveFromCart} src={assets.remove_icon_red} alt="..." />
            <p>{cartItems[id]}</p>
            <img onClick={handleAddToCart} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
