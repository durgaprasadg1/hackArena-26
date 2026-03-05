import mongoose from "mongoose";

const WaterLogSchema = new mongoose.Schema(
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

    amount: {
      type: Number, // in liters
      required: true,
      min: 0,
      max: 20, // Reasonable max for safety
    },

    logs: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        amount: Number, // Individual log amounts
      },
    ],
  },
  { timestamps: true },
);

// Compound index for user-date queries
WaterLogSchema.index({ userId: 1, date: 1 }, { unique: true });

// Method to add water intake
WaterLogSchema.methods.addWater = function (amount) {
  this.logs.push({ amount, timestamp: new Date() });
  this.amount += amount;
  return this.save();
};

const WaterLog =
  mongoose.models.WaterLog || mongoose.model("WaterLog", WaterLogSchema);

export default WaterLog;
