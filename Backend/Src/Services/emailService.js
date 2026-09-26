const nodemailer = require("nodemailer");

const config = require("../Config/config");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        type: "OAuth2",
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
});

const sendEmailOTP = async (email, otp) => {
    await transporter.sendMail({
        from: `"Vibora" <${config.GOOGLE_USER}>`,
        to: email,
        subject: "Vibora verification code",
        text: `Your Vibora verification code is ${otp}. It expires in 5 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Vibora verification</h2>
                <p>Your verification code is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 5 minutes.</p>
                <p>Do not share this code with anyone.</p>
            </div>
        `
    });
};

module.exports = {sendEmailOTP};