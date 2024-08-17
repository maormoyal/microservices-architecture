const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../db-models/users.model');

const JWT_SECRET = process.env.JWT_SECRET;
const revokedTokens = new Set();

async function registerUser({ username, email, password }) {
  const user = new User({
    username,
    email,
    password,
  });

  await user.save();

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return { userId: user._id, username, email, token };
}

async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return {
    userId: user._id,
    username: user.username,
    email: user.email,
    token,
  };
}

module.exports = {
  registerUser,
  authenticateUser,
};

async function getUserProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  return { userId: user._id, username: user.username, email: user.email };
}

async function logoutUser(token) {
  revokedTokens.add(token); // Add the token to the revoked tokens set
}

module.exports = {
  registerUser,
  authenticateUser,
  getUserProfile,
  logoutUser,
};
