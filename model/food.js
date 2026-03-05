import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },

    locality: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    servingSize: {
      value: Number,
      unit: String,
    },

    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
    },

    minerals: {
      sodium: Number,
      potassium: Number,
      calcium: Number,
      iron: Number,
      phosphorus: Number,
    },

    vitamins: {
      vitaminA: Number,
      vitaminB: Number,
      vitaminC: Number,
      vitaminD: Number,
      vitaminE: Number,
      vitaminK: Number,
    },

    verification: {
      verified: {
        type: Boolean,
        default: false,
      },

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

FoodSchema.index({ createdBy: 1 });
FoodSchema.index({ "verification.approvedBy": 1 });
FoodSchema.index({ "verification.verified": 1 });

const Food = mongoose.models.Food || mongoose.model("Food", FoodSchema);

export default Food;
