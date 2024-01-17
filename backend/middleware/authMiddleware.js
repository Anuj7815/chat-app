const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decode token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Not Authorized, token failed!");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not Authorized,  no token');
  }
});

module.exports = { protect };