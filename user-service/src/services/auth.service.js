const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../db-models/users.model');

async function registerUser(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return null;

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
}

module.exports = {
  registerUser,
  loginUser,
};
