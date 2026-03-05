import mongoose from "mongoose";

const CalorieAdjustmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    referenceDate: Date,

    extraCalories: Number,

    daysDistributed: Number,

    adjustmentPerDay: Number,

    applied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

CalorieAdjustmentSchema.index({ userId: 1 });
CalorieAdjustmentSchema.index({ referenceDate: 1 });
CalorieAdjustmentSchema.index({ userId: 1, referenceDate: 1 });

const CalorieAdjustment = mongoose.model(
  "CalorieAdjustment",
  CalorieAdjustmentSchema,
);

export default CalorieAdjustment;
