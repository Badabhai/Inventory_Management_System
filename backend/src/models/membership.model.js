import mongoose, { Schema } from "mongoose";

const membershipSchema = new mongoose.Schema({
  organisation: {
    type: Schema.Types.ObjectId,
    ref: "Organisation",
    required: true,
  },
  member: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "admin", "member"],
    default: "member",
  },
});

export const Membership = mongoose.model("Membership", membershipSchema);
