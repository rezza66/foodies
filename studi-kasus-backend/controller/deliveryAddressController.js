import DeliveryAddress from '../models/deliveryAddressModel.js';

export const createDeliveryAddress = async (req, res, next) => {
  try {
    const deliveryAddress = new DeliveryAddress({...req.body, user: req.user._id});
    await deliveryAddress.save();
    res.status(201).json(deliveryAddress);
  } catch (error) {
    next(error)
  }
};

export const getDeliveryAddresses = async (req, res, next) => {
  try {
    const deliveryAddresses = await DeliveryAddress.find({ user: req.user._id }).populate('user');
    
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

export const deleteDeliveryAddress = async (req, res, next) => {
  try {
    const deliveryAddress = await DeliveryAddress.findByIdAndDelete(req.params.id);
    if (!deliveryAddress) {
      return res.status(404).json({ message: 'Delivery Address not found' });
    }
    res.status(200).json({ message: 'Delivery Address deleted' });
  } catch (error) {
    next(error)
  }
};
