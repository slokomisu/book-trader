const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = function(req, res) {
  const user = req.user;
  const { username, books, _id } = user;
  const payload = {
    id: _id,
    username,
    books
  };
  const token = jwt.sign(payload, process.env.SECRET);
  res.json({ token });
};

exports.register = async function(req, res) {
  try {
    const newUser = await User.register(
      new User(req.body.username),
      req.body.password
    );
    const payload = {
      id: _id,
      username,
      books
    };
    const token = jwt.sign(payload, process.env.SECRET);
    res.json({ token });
  } catch (error) {
    res.json({error});
  }
};
