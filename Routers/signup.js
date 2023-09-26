const express = require("express");
const router = express.Router();
const pool = require("../connection")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const {v4:uuidv4 }  = require('uuid');
const e = require("express");
const nodemailer = require('nodemailer')
const JWT_SECRET = 'Amitisagoodb$oy'


// Define the route for user registration (signup)

// Define the route for user registration (signup)
router.post('/signup', async (req, res) => {
  const id = uuidv4();
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Retrieve the role ID based on the role name from the request
    const roleName = req.body.role_name; // Assuming you have the role name in the request

    const roleQuery = 'SELECT role_id FROM roles WHERE role_name = $1';
    const roleResult = await pool.query(roleQuery, [roleName]);

    if (roleResult.rows.length === 0) {
      // Handle the case where the role does not exist
      return res.status(400).json({ error: 'Role not found' });
    }

    const roleid = roleResult.rows[0].role_id;

    // Insert user data into the database
    const userQuery = {
      text:
        'INSERT INTO users (id, roleid, name, email, password) VALUES ($1, $2, $3, $4, $5)',
      values: [id, roleid, name, email, hashedPassword],
    };

    mailer(email);
    await pool.query(userQuery);
    const token = jwt.sign({ userId: id, role: roleName }, JWT_SECRET);

    // Return a success response
    res.status(201).json({ success: true, message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    // Return an error response
    res.status(500).json({ success: false, message: 'Error during registration' });
  }
});



// Define the route for user login
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      // Search for the user based on the provided email
      const userQuery = 'SELECT * FROM users WHERE email = $1';
      const userResult = await pool.query(userQuery, [email]);
  
      if (userResult.rows.length === 0) {
        // If the user with the given email is not found, return an error
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = userResult.rows[0];
  
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        // If passwords do not match, return an error
        return res.status(401).json({ error: 'Incorrect password' });
      }
  
      // Fetch the user's role information from the database
      const roleQuery = 'SELECT role_name FROM roles WHERE role_id = $1';
      console.log('User roleid:', user.roleid);
      const roleResult = await pool.query(roleQuery, [user.roleid]);
  
      if (roleResult.rows.length === 0) {
        // If the user's role is not found, return an error
        return res.status(500).json({ error: 'User role not found' });
      }
  
      const role = roleResult.rows[0].role_name;
  
      // If passwords match, generate a JWT token
      const token = jwt.sign({ userId: user.id, role }, JWT_SECRET);
console.log(role);
      // Return the token and role name in the response
      res.status(200).json({ success: true, message: 'Login successful', token, role });
    } catch (error) {
      console.error(error);
      // Return an error response
      res.status(500).json({ success: false, message: 'Error during login' });
    }
  });
  



router.get('/me', (req, res) => {

    pool.query('select * from users ', (err, result) => {
        if (err) {
            res.send(err)
            console.log(err);
        }
        else {
            res.send(result)
            console.log(result);
        }
    })

});

const mailer = (email) => {

  var transporter = nodemailer.createTransport({
service: "smtp@gmail.com",
port: 587,
secure: false,
requireTLS: true,
      auth: {
          user: 'amitkumar171117@gmail.com',
          pass: 'xbhmjnlohdyowjpp'
      }
  });

  var mailoption = {
      form: 'amitkumar171117@gmail.com',
      to: email,
      subject: 'Sending Mail using Nodejs',
      text: `email varification `
  };
  transporter.sendMail(mailoption, function (error, Info) {
      if (error) {
          console.log(error);
      }
      else {
          console.log('Email sent to: ' + Info.response);
      }
  });
}





module.exports = router;