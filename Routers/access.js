
// accessRouter.js
const express = require('express');
const router = express.Router();
const authorize = require('../middleware/fetchuser');

// Route for admin role (can read, write, update)
router.get('/admin-data', authorize(['admin']), (req, res) => {
  res.json({ success: true, message: 'Admin Data (Read, Write, Update) accessible' });
});

router.post('/admin-data', authorize(['admin']), (req, res) => {
  res.json({ success: true, message: 'Admin Data (Read, Write, Update) accessible' });
});

router.put('/admin-data', authorize(['admin']), (req, res) => {
  res.json({ success: true, message: 'Admin Data (Read, Write, Update) accessible' });
});

// Route for manager role (can read and write)
router.get('/manager-data', authorize(['admin', 'manager']), (req, res) => {
  res.json({ success: true, message: 'Manager Data (Read, Write) accessible' });
});

router.post('/manager-data', authorize(['admin', 'manager']), (req, res) => {
  res.json({ success: true, message: 'Manager Data (Read, Write) accessible' });
});

// Route for user role (can read only)
router.get('/user-data', authorize(['admin', 'manager', 'user']), (req, res) => {
  res.json({ success: true, message: 'User Data (Read) accessible' });
});

module.exports = router;

