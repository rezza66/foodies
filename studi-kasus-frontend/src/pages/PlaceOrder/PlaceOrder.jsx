import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fetchAddresses } from "../../redux/slices/addressSlice";

const PlaceOrder = () => {
  const dispatch = useDispatch();
  
  // Ambil data dari Redux store
  const {
    addresses,
    status: addressStatus,
    error: addressError
  } = useSelector((state) => state.addresses);
  
  const { data: user } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const token = useSelector((state) => state.auth.token);

  React.useEffect(() => {
    if (token) {
      dispatch(fetchAddresses(token));
    } else {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "No token found. Please log in again.",
      });
    }
  }, [token, dispatch]);

  // Hitung total harga cart
  const totalCartAmount = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  if (addressStatus === "loading") return (
    <div className="text-center py-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (addressStatus === "failed") return (
    <div className="alert alert-danger text-center">
      {addressError || "Failed to load addresses"}
    </div>
  );

  return (
    <form className="place-order container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="card-title mb-4">Delivery Information</h3>
              
              {user && (
                <div className="mb-4 p-3 border rounded">
                  <h5 className="mb-2">Contact Information</h5>
                  <p className="mb-1"><strong>Full Name:</strong> {user.fullname || user.username}</p>
                  <p className="mb-0"><strong>Email:</strong> {user.email}</p>
                </div>
              )}

              <h5 className="mb-3">Shipping Address</h5>
              
              {addresses.length > 0 ? (
                <div className="list-group">
                  {addresses.map((address) => (
                    <div key={address._id} className="list-group-item mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-2">{address.nama || "My Address"}</h6>
                          <p className="mb-1 text-muted">
                            {address.detail}, {address.kelurahan}, {address.kecamatan},{" "}
                            {address.kabupaten}, {address.provinsi}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-warning">
                  No addresses available. Please add a delivery address.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Order Summary</h3>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${totalCartAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee:</span>
                  <span>${totalCartAmount === 0 ? 0 : 2.00}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>${totalCartAmount === 0 ? 0 : (totalCartAmount + 2).toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="btn btn-primary w-100 py-2"
                type="submit" 
                disabled={totalCartAmount === 0 || addresses.length === 0}
              >
                PROCEED TO PAYMENT
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;