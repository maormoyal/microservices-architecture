const userService = require('../services/user.service');

async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await userService.registerUser({ username, email, password });
    res.status(201).send(user);
  } catch (error) {
    res
      .status(400)
      .send({ error: 'Registration failed', details: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser({ email, password });
    res.status(200).send(user);
  } catch (error) {
    res.status(401).send({ error: 'Login failed', details: error.message });
  }
}

async function getProfile(req, res) {
  try {
    const userId = req.user.userId;
    const user = await userService.getUserProfile(userId);
    res.status(200).send(user);
  } catch (error) {
    res
      .status(500)
      .send({ error: 'Failed to fetch user profile', details: error.message });
  }
}

async function logout(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await userService.logoutUser(token);
    res.status(200).send({ message: 'User successfully logged out' });
  } catch (error) {
    res.status(500).send({ error: 'Logout failed', details: error.message });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  logout,
};
