import Cart from '../models/cartItemModel.js';

export const getCartItems = async (req, res, next) => {
    try {
        const items = await Cart
            .find({ user: req.user._id }) 
            .populate('product') 
            .populate('user'); 

        return res.json(items);
    } catch (err) {
        return res.status(500).json({
            error: 1,
            message: err.message
        });
    }
};

export const updateCarts = async (req, res, next) => {
    try {
        const { operations } = req.body;

        if (!Array.isArray(operations)) {
            return res.status(400).json({ message: 'Operations harus berupa array' });
        }

        const result = await Cart.bulkWrite(operations);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
};
