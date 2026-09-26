const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "artist"],
      default: "user"
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // Automatically deletes expired documents
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema
);