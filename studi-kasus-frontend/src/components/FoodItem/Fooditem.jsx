import { assets } from "../../assets/assets";
import "./FoodItem.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  updateCartItem,
  fetchCartItems,
  removeCartItem,
} from "../../redux/slices/cartSlice";

const FoodItem = ({ id, name, price, description, image }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const user = useSelector((state) => state.user.data);

  const cartItem = cartItems.find(item => item.product?._id === id);

  const handleAddToCart = async () => {
  if (!user || !user._id) {
    alert("Anda harus login untuk menambahkan ke keranjang.");
    return;
  }

  if (cartItem) {
    await dispatch(updateCartItem({ id: cartItem._id, qty: cartItem.qty + 1 }));
  } else {
    await dispatch(addToCart({
      product: id,
      name,
      qty: 1,
      price,
      image,
      user: user._id,
    }));
  }

  dispatch(fetchCartItems());
};


  const handleRemoveCartItem = () => {
    if (cartItem) {
      dispatch(removeCartItem(cartItem._id));
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img src={image} alt={name} className="food-item-image" />
        {!cartItem ? (
          <img
            className="add"
            onClick={handleAddToCart}
            src={assets.add_icon_white}
            alt="Tambah ke keranjang"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={handleRemoveCartItem}
              src={assets.remove_icon_red}
              alt="Kurangi item"
            />
            <p>{cartItem.qty}</p>
            <img
              onClick={handleAddToCart}
              src={assets.add_icon_green}
              alt="Tambah item"
            />
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
