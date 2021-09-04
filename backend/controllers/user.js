const bcrypt = require("bcrypt");
const User = require("../models/user");

const registerUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send("Incomplete data");

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser)
    return res.status(400).send("The user is already registered");

  const hash = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    dbStatus: true,
  });

  const result = await user.save();
  if (!result) return res.status(400).send("Failed to register user");
  try {
    const jwtToken = user.generateJWT();
    res.status(200).send({ jwtToken });
  } catch (e) {
    return res.status(400).send("Token generation failed");
  }
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Wrong email or password");

  if (!user.dbStatus) return res.status(400).send("Wrong email or password");

  const hash = await bcrypt.compare(req.body.password, user.password);
  if (!hash) return res.status(400).send("Wrong email or password");

  try {
    const jwtToken = user.generateJWT();
    return res.status(200).send({ jwtToken });
  } catch (e) {
    return res.status(400).send("Login error");
  }
};


const updateUser = async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.email || !req.body.roleId)
    return res.status(400).send("Incomplete data");

  let pass = "";

  if (req.body.password) {
    pass = await bcrypt.hash(req.body.password, 10);
  } else {
    const userFind = await User.findOne({ email: req.body.email });
    pass = userFind.password;
  }

  const user = await User.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
  });

  if (!user) return res.status(400).send("Error editing user");
  return res.status(200).send({ user });
};

const deleteUser = async (req, res) => {
  if (!req.body._id) return res.status(400).send("Incomplete data");

  const user = await User.findByIdAndUpdate(req.body._id, {
    dbStatus: false,
  });
  if (!user) return res.status(400).send("Error delete user");
  return res.status(200).send({ user });
};



module.exports = {
  registerUser,
  login,
  updateUser,
  deleteUser,
};
