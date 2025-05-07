import User from '../models/userModel.js';

// Create a new user
export const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const newUser = new User({ username, email, password, role });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error)
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error)
  }
};

// Get a single user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    next(error)
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
      const _id = req.user._id; // ID dari JWT
      const user = await User.findById(_id).select("-password"); 

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    next(error);
  }
};

// Update a user by ID
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { username, email, password, role }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error)
  }
};

// Delete a user by ID
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error)
  }
};
