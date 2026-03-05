import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["cardio", "strength", "flexibility", "balance", "functional"],
    },

    caloriesPerMinute: Number,

    caloriesPerSet: Number,

    muscleGroups: [String],

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },

    description: String,

    imageUrl: String,

    verification: {
      verified: {
        type: Boolean,
        default: false,
      },
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

  // Additional indexes for common filters
  ExerciseSchema.index({ type: 1 });
  ExerciseSchema.index({ difficulty: 1 });
  ExerciseSchema.index({ muscleGroups: 1 });
  ExerciseSchema.index({ addedBy: 1 });

  const Exercise = mongoose.model("Exercise", ExerciseSchema);

export default Exercise;
