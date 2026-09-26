const express = require("express");
const router = express.Router();

const { registerStart, verifyRegisterEmail, resendRegisterOTP, completeRegistration, loginUser, requestLoginOTP, verifyLoginOTP, refreshAccessToken, logoutUser, logoutAllDevices, getCurrentUser} = require("../Controllers/Auth.controller");
const { authenticateAccessToken } = require("../Middlewares/Auth.middleware");

router.post("/register/start", registerStart);
router.post("/register/verify-email", verifyRegisterEmail);
router.post("/register/resend", resendRegisterOTP);
router.post("/register/complete", completeRegistration);

router.post("/login", loginUser);
router.post("/login/request-otp", requestLoginOTP);
router.post("/login/verify-otp", verifyLoginOTP);

router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/logout-all", authenticateAccessToken, logoutAllDevices);
router.get("/me", authenticateAccessToken, getCurrentUser);

module.exports = router;