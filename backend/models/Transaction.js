import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  signature: { type: String, unique: true },
  wallet_address: String,
  amount: Number,
  direction: String,
  protocol: String,
  timestamp: Date,
});

transactionSchema.index({ timestamp: -1 });
transactionSchema.index({ wallet_address: 1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);
