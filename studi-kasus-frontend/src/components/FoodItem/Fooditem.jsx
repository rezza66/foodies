import React from "react";
import { assets } from "../../assets/assets";
import "./FoodItem.css";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, fetchCartItems, removeCartItem } from "../../redux/slices/cartSlice";

const FoodItem = ({ id, name, price, description, image }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems) || []; // ✅ Hindari undefined
  const user = useSelector((state) => state.user.data); // ✅ Ambil user dari Redux dengan benar

  // Cari item di cart berdasarkan id
  const cartItem = cartItems.find(item => item.product === id);

  const handleAddToCart = () => {
    if (!user || !user._id) {
      alert("Anda harus login untuk menambahkan ke keranjang.");
      return;
    }
  
    if (cartItem) {
      // ✅ Jika item sudah ada, perbarui qty
      dispatch(updateCartItem({ id: cartItem._id, qty: cartItem.qty + 1 }));
    } else {
      dispatch(addToCart({
        product: id,
        name,
        qty: 1,
        price,
        image,
        user: user._id,
      }));
      dispatch(fetchCartItems());
    }
  };
  
  const handleRemoveCartItem = () => {
    dispatch(removeCartItem(id));
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img src={image} alt={name} className="food-item-image" />
        {!cartItem ? (
          <img className="add" onClick={handleAddToCart} src={assets.add_icon_white} alt="Tambah ke keranjang" />
        ) : (
          <div className="food-item-counter">
            <img onClick={handleRemoveCartItem} src={assets.remove_icon_red} alt="Kurangi item" />
            <p>{cartItem.qty}</p> {/* ✅ Gunakan qty dari Redux state */}
            <img onClick={handleAddToCart} src={assets.add_icon_green} alt="Tambah item" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
