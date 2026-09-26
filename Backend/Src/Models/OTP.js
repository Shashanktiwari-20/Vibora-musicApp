const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
            index: true
        },
        channel: {
            type: String,
            enum: ["email"],
            default: "email",
            required: true
        },
        purpose: {
            type: String,
            enum: ["register_email", "login"],
            required: true
        },
        otpHash: {
            type: String,
            required: true
        },
        attempts: {
            type: Number,
            default: 0
        },
        maxAttempts: {
            type: Number,
            default: 5
        },
        expiresAt: {
            type: Date,
            required: true
        },
        usedAt: {
            type: Date,
            default: null
        },
        registrationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PendingRegistration",
            default: null
        }
    },
    {
        timestamps: true
    }
);

otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

otpSchema.index({
    identifier: 1,
    channel: 1,
    purpose: 1,
    createdAt: -1
});

module.exports = mongoose.model("OTP", otpSchema);