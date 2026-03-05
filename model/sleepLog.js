import mongoose from "mongoose";

const SleepLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    hours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },

    quality: {
      type: String,
      enum: ["poor", "fair", "good", "excellent"],
      default: "good",
    },

    bedTime: Date,
    wakeTime: Date,

    notes: String,
  },
  { timestamps: true },
);

// Compound index for user-date queries
SleepLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const SleepLog =
  mongoose.models.SleepLog || mongoose.model("SleepLog", SleepLogSchema);

export default SleepLog;
