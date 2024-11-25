import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  const { username, email, password, role } = req.body;
  try {
    console.log('Request body:', req.body);
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password, role });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error)
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error)
  }
};





