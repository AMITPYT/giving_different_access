
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Amitisagoodb$oy'; // Replace with your JWT secret key

function authorize(allowedRoles) {
    return (req, res, next) => {
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        console.log("dhdh",decodedToken);
        const userRole = decodedToken.role;
  
        if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({ error: 'Forbidden' });
        }
  
        next(); // Allow access if the user's role is allowed
      } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    };
  }

module.exports = authorize;
