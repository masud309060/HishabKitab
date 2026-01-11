import mongoose, { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now,
        },
        note: {
            type: String,
        },
        type: {
            type: String,
            enum: ["income", "expense"],
            required: [true, "Type is required"],
        },
    },
    { timestamps: true }
);

const Transaction = models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
