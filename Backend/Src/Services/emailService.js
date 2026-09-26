const nodemailer = require("nodemailer");
const config = require("../Config/config");

const createTransporter = () => {
    const emailUser = process.env.EMAIL_USER || config.GOOGLE_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.GOOGLE_APP_PASSWORD;

    // 1. App Password authentication (Faster, direct, and avoids token expiration)
    if (emailPass) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailUser,
                pass: emailPass
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000
        });
    }

    // 2. Fallback to OAuth2 authentication if configured
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: config.GOOGLE_USER,
            clientId: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            refreshToken: config.GOOGLE_REFRESH_TOKEN
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
    });
};

const transporter = createTransporter();

const sendEmailOTP = async (email, otp) => {
    const sender = process.env.EMAIL_USER || config.GOOGLE_USER || "no-reply@vibora.com";

    return await transporter.sendMail({
        from: `"Vibora Music" <${sender}>`,
        to: email,
        subject: `${otp} is your Vibora verification code`,
        text: `Your Vibora verification code is ${otp}. It expires in 5 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 28px; border-radius: 12px; max-width: 480px; margin: auto;">
                <h2 style="color: #06b6d4; margin-top: 0;">Vibora Verification</h2>
                <p style="font-size: 15px; color: #cbd5e1;">Use the verification code below to complete your registration:</p>
                <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0; border: 1px solid #334155;">
                    <span style="font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #22d3ee;">${otp}</span>
                </div>
                <p style="font-size: 13px; color: #94a3b8; margin-bottom: 4px;">This code expires in 5 minutes.</p>
                <p style="font-size: 13px; color: #94a3b8;">If you did not request this code, please ignore this email.</p>
            </div>
        `
    });
};

module.exports = { sendEmailOTP };