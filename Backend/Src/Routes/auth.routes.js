const Express = require("express");
const AuthController = require("../Controllers/Auth.controller")
const {registerUserValidationRule} = require("../Middlewares/Validation.middleware")
const Router = Express.Router();

Router.post("/register",registerUserValidationRule,AuthController.registerUser);
Router.post("/login",AuthController.loginUser);
Router.post("/logout",AuthController.LogoutUser);
Router.get("/me",AuthController.getCurrentUser);


module.exports = Router