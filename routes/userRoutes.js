const express = require("express");
const { adminOnly, protect } = require("../middlewares/authmiddleware");
const { getUsers, getUserById } = require("../controllers/userController");

const route = express.Router();

route.get("/users/", protect, adminOnly, getUsers);
route.get("/users/:id", protect, adminOnly, getUserById);


module.exports = route;
