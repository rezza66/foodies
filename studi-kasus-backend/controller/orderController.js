import mongoose, { Types } from "mongoose";
import CartItem from "../models/cartItemModel.js";
import DeliveryAddress from "../models/deliveryAddressModel.js";
import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItemModel.js";

export const getOrder = async (req, res, next) => {
  try {
    const { skip = 0, limit = 10 } = req.query;
    const count = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate({
        path: "order_items",
        populate: {
          path: "product",
          select: "name price image"
        }
      })
      .sort("-createdAt");

    return res.status(200).json({
      success: true,
      data: orders.map(order => order.toJSON({ virtuals: true })),
      pagination: {
        total: count,
        skip: parseInt(skip),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { delivery_fee, delivery_address } = req.body;

    // Validasi input
    if (!delivery_address) {
      throw new Error("Delivery address is required");
    }

    // Cek items di cart
    const items = await CartItem.find({ user: req.user._id })
      .populate("product")
      .session(session);

    if (!items || items.length === 0) {
      throw new Error("Cannot create order with empty cart");
    }

    // Verifikasi alamat pengiriman
    const address = await DeliveryAddress.findOne({
      _id: delivery_address,
      user: req.user._id
    }).session(session);

    if (!address) {
      throw new Error("Delivery address not found or not owned by user");
    }

    // Buat order
    const order = new Order({
      _id: new Types.ObjectId(),
      status: "waiting_payment",
      delivery_fee: parseInt(delivery_fee) || 0,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail
      },
      user: req.user._id
    });

    // Buat order items
    const orderItems = await OrderItem.insertMany(
      items.map(item => ({
        name: item.product.name,
        price: parseInt(item.product.price),
        qty: parseInt(item.qty),
        product: item.product._id,
        order: order._id
      })),
      { session }
    );

    // Simpan order
    order.order_items = orderItems.map(item => item._id);
    await order.save({ session });

    // Hapus cart items
    await CartItem.deleteMany({ user: req.user._id }, { session });

    // Commit transaction
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      data: order.toJSON({ virtuals: true }),
      message: "Order created successfully"
    });

  } catch (error) {
    await session.abortTransaction();
    
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        errorNumber: 1,
        message: error.message,
        fields: error.errors
      });
    } else if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        errorNumber: 2,
        message: "Invalid data format"
      });
    }

    return res.status(400).json({
      success: false,
      errorNumber: 3,
      message: error.message || "Failed to create order"
    });
  } finally {
    session.endSession();
  }
};