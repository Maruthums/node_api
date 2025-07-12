const express = require('express');
const router = express.Router();
const User = require('../module/user');

// GET all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// POST a new user
router.post('/', async (req, res) => {
  console.log('.........');

  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  console.log('.........');
  res.status(201).json(user);
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: 'User deleted' });
});

module.exports = router;
