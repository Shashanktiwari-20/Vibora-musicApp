const { google } = require("googleapis");
const config = require("../Config/config");

const oAuth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({ refresh_token: config.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN});

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

const makeBody = (to, from, subject, message) => {
    const str = [
        `To: ${to}`,
        `From: "Vibora Music" <${from}>`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "",
        message
    ].join("\r\n");

    return Buffer.from(str)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

const sendEmailOTP = async (email, otp) => {
    const sender = config.GOOGLE_USER || process.env.GOOGLE_USER;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 28px; border-radius: 12px; max-width: 480px; margin: auto;">
            <h2 style="color: #06b6d4; margin-top: 0;">Vibora Verification</h2>
            <p style="font-size: 15px; color: #cbd5e1;">Use the verification code below to complete your registration:</p>
            <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0; border: 1px solid #334155;">
                <span style="font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #22d3ee;">${otp}</span>
            </div>
            <p style="font-size: 13px; color: #94a3b8; margin-bottom: 4px;">This code expires in 5 minutes.</p>
            <p style="font-size: 13px; color: #94a3b8;">If you did not request this code, please ignore this email.</p>
        </div>
    `;

    const raw = makeBody(email, sender, `${otp} is your Vibora verification code`, htmlContent);

    return await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw }
    });
};

module.exports = { sendEmailOTP };