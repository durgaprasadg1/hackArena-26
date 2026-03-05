import mongoose from "mongoose";

const MealLogSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  date: {
    type: Date,
    required: true,
    index: true
  },

  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "snacks", "dinner"]
  },

  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food"
  },

  quantity: Number,

  caloriesConsumed: Number

},
{ timestamps: true }
);

MealLogSchema.index({ userId: 1, date: 1 });

const MealLog = mongoose.model("MealLog", MealLogSchema);

export default MealLog;