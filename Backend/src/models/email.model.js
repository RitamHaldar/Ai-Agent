import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const emailModel = mongoose.model("email", emailSchema);