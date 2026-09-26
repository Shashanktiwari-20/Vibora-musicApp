const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        refreshTokenHash: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        revokedAt: {
            type: Date,
            default: null
        },

        userAgent: {
            type: String,
            default: null
        },

        ipAddress: {
            type: String,
            default: null
        },

        lastUsedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

sessionSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("Session", sessionSchema);