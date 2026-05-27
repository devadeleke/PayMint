import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true,
        minLength: 6
    },

    lastLogin: Date,
    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: String,
    verificationTokenExpiry: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;