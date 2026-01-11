import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false, // Prevents password from being returned in queries by default
        },
        settings: {
            currency: {
                type: String,
                default: "USD",
                enum: ["USD", "BDT", "EUR", "GBP", "JPY", "CAD", "AUD"],
            },
            theme: {
                type: String,
                default: "system",
                enum: ["light", "dark", "system"],
            },
        },
    },
    { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
