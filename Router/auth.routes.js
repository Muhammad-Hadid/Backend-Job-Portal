const express = require("express");
const Router = express.Router();
const { login, register, logout } = require("../Controller/auth.controller");


Router.post("/register", register);
Router.post("/login", login);
Router.post("/logout", logout);
module.exports = Router;
