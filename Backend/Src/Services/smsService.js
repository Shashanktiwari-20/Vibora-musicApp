const twilio = require("twilio");
const config = require("../Config/config");

const client = twilio(
  config.TWILIO_ACCOUNT_SID,
  config.TWILIO_AUTH_TOKEN
);


const sendSMSOTP = async ({ to }) => {
  if (!to) {
    throw new Error("Mobile number is required to send SMS OTP.");
  }

  const formattedNumber = to.startsWith("+") ? to : `+${to}`;

  const verification = await client.verify.v2
    .services(config.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({
      to: formattedNumber,
      channel: "sms"
    });

  return verification;
};

const verifySMSOTP = async ({ to, otp }) => {
  if (!to || !otp) {
    throw new Error("Mobile number and OTP are required.");
  }

  const formattedNumber = to.startsWith("+") ? to : `+${to}`;

  const verificationCheck = await client.verify.v2
    .services(config.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: formattedNumber,
      code: otp
    });

  return verificationCheck.status === "approved";
};

module.exports = {sendSMSOTP,verifySMSOTP};