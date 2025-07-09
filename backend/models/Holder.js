import mongoose from "mongoose";

const holderSchema = new mongoose.Schema({
  wallet_address: { type: String, unique: true },
  token_balance: Number,
  updated_at: { type: Date, default: Date.now },
});

export const Holder = mongoose.model("Holder", holderSchema);
