import DeliveryAddress from '../models/deliveryAddressModel.js';
import mongoose from 'mongoose';

export const createDeliveryAddress = async (req, res, next) => {
  try {
    const deliveryAddress = new DeliveryAddress({...req.body, user: req.user._id});
    await deliveryAddress.save();
    res.status(201).json({
      success: true,
      data: deliveryAddress,
      message: 'Alamat berhasil dibuat'
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryAddresses = async (req, res, next) => {
  try {
    const deliveryAddresses = await DeliveryAddress.find(
      { user: req.user._id },
      { user: 0 } // Exclude user field dari response
    );
    res.status(200).json(deliveryAddresses);
  } catch (error) {
    next(error);
  }
};


export const getDeliveryAddressById = async (req, res, next) => {
  try {
    const deliveryAddress = await DeliveryAddress.findById(req.params.id).populate('user');
    if (!deliveryAddress) {
      return res.status(404).json({ message: 'Delivery Address not found' });
    }
    res.status(200).json(deliveryAddress);
  } catch (error) {
    next(error)
  }
};

export const updateDeliveryAddress = async (req, res, next) => {
  try {
    const deliveryAddress = await DeliveryAddress.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!deliveryAddress) {
      return res.status(404).json({ message: 'Delivery Address not found' });
    }
    res.status(200).json(deliveryAddress);
  } catch (error) {
    next(error)
  }
};

export const deleteDeliveryAddress = async (req, res) => {
  try {
    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID tidak valid' 
      });
    }

    // Pastikan alamat milik user yang login
    const address = await DeliveryAddress.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Alamat tidak ditemukan atau tidak memiliki akses'
      });
    }

    res.status(200).json({
      success: true,
      data: { _id: req.params.id },
      message: 'Alamat berhasil dihapus'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};
