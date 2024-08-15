const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../db-models/users.model');

// Replace 'your_jwt_secret_key' with your actual secret key, ideally stored in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).send({ userId: user._id, username, email, token });
  } catch (error) {
    res.status(400).send({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).send({ error: 'Invalid email or password' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).send({ error: 'Invalid email or password' });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res
      .status(200)
      .send({
        userId: user._id,
        username: user.username,
        email: user.email,
        token,
      });
  } catch (error) {
    res.status(400).send({ error: 'Login failed' });
  }
}

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).send({ error: 'User not found' });

    res
      .status(200)
      .send({ userId: user._id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch user profile' });
  }
}

module.exports = {
  register,
  login,
  getProfile,
};
