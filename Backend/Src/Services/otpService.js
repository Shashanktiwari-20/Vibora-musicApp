const OTP = require("../Models/OTP");
const {
    generateOTP,
    hashOTP,
    compareHash
} = require("./tokenService");

const { sendEmailOTP } = require("./emailService");
const { sendSMSOTP } = require("./smsService");

const OTP_EXPIRY = 5 * 60 * 1000;
const RESEND_COOLDOWN = 60 * 1000;
const MAX_ATTEMPTS = 5;

const sendOTP = async ({
    identifier,
    channel,
    purpose,
    registrationId = null
}) => {

    const normalizedIdentifier =
        identifier.trim().toLowerCase();

    const latestOTP = await OTP.findOne({
        identifier: normalizedIdentifier,
        channel,
        purpose,
        registrationId
    }).sort({
        createdAt: -1
    });

    if (
        latestOTP &&
        Date.now() - latestOTP.createdAt.getTime() < RESEND_COOLDOWN
    ) {
        const remaining = Math.ceil(
            (
                RESEND_COOLDOWN -
                (Date.now() - latestOTP.createdAt.getTime())
            ) / 1000
        );

        const error = new Error(
            `Please wait ${remaining} seconds before requesting another OTP.`
        );

        error.statusCode = 429;

        throw error;
    }

    const otp = generateOTP();

    const otpHash = hashOTP({
        identifier: normalizedIdentifier,
        purpose,
        otp
    });

    const otpDocument = await OTP.create({
        identifier: normalizedIdentifier,
        channel,
        purpose,
        otpHash,
        attempts: 0,
        maxAttempts: MAX_ATTEMPTS,
        expiresAt: new Date(
            Date.now() + OTP_EXPIRY
        ),
        registrationId
    });

    try {

        if (channel === "email") {

            await sendEmailOTP(
                normalizedIdentifier,
                otp
            );

        } else if (channel === "sms") {

            await sendSMSOTP({
                to: normalizedIdentifier,
                otp
            });

        } else {

            throw new Error(
                "Invalid OTP channel."
            );
        }

    } catch (error) {

        await OTP.findByIdAndDelete(
            otpDocument._id
        );

        throw error;
    }

    return otpDocument;
};


const verifyOTP = async ({
    identifier,
    channel,
    purpose,
    otp,
    registrationId = null
}) => {

    const normalizedIdentifier =
        identifier.trim().toLowerCase();

    const otpDocument = await OTP.findOne({
        identifier: normalizedIdentifier,
        channel,
        purpose,
        registrationId,
        usedAt: null
    }).sort({
        createdAt: -1
    });

    if (!otpDocument) {

        const error = new Error(
            "OTP not found."
        );

        error.statusCode = 400;

        throw error;
    }

    if (
        otpDocument.expiresAt.getTime() < Date.now()
    ) {

        const error = new Error(
            "OTP has expired."
        );

        error.statusCode = 400;

        throw error;
    }

    if (
        otpDocument.attempts >=
        otpDocument.maxAttempts
    ) {

        const error = new Error(
            "Maximum OTP attempts exceeded."
        );

        error.statusCode = 429;

        throw error;
    }

    const submittedHash = hashOTP({
        identifier: normalizedIdentifier,
        purpose,
        otp
    });

    const isValid = compareHash(
        submittedHash,
        otpDocument.otpHash
    );

    if (!isValid) {

        otpDocument.attempts += 1;

        await otpDocument.save();

        const error = new Error(
            "Invalid OTP."
        );

        error.statusCode = 400;

        throw error;
    }

    otpDocument.usedAt = new Date();

    await otpDocument.save();

    return true;
};


module.exports = {
    sendOTP,
    verifyOTP
};