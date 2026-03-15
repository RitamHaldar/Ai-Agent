import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"]
    },
    title: {
        type: String,
        require: [true, "Title is required"]

    }
}, { timestamps: true })

export const chatModel = mongoose.model("chat", chatSchema)
