import mongoose from "mongoose";

const MealLogSchema = new mongoose.Schema(
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

    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "snacks", "dinner"],
      required: true,
    },

    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    foodName: String,

    quantity: {
      type: Number,
      default: 1,
    },

    servingSize: {
      value: Number,
      unit: String,
    },

    // Nutritional breakdown for this specific entry
    nutritionConsumed: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
    },
  },
  { timestamps: true },
);

MealLogSchema.index({ userId: 1, date: 1 });

const MealLog = mongoose.model("MealLog", MealLogSchema);

export default MealLog;
