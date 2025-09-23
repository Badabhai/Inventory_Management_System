import mongoose, { Schema } from "mongoose";

const organisationSchema = mongoose.Schema(
  {
    organisationName: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Organisation = mongoose.model("Organisation", organisationSchema);
