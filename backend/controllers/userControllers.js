const expressAsyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const bcrypt = require('bcrypt');

const registerUser = expressAsyncHandler(async (req,res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400).json("Error: Enter all details Properly.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json('Email already Exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
      message: 'User Created Successfully.'
    });
  } else {
    res.status(400).json('Error: User not Created!');
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400), json('Error: Email and Password Required!');

  const user = await User.findOne({ email }).exec();
  if (!user) return res.sendStatus(401);  //Unauthorized

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    console.log(user);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
      message: 'User Logged In Successfully.'
    });
  } else {
    res.status(409).json("Error: Invalid Email or Password!");
  }
});

// /api/user?search=anuj
const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ]
  } : {};

  const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
  res.send(users);
});

module.exports = { registerUser,authUser,allUsers };