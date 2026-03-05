import mongoose from "mongoose";

const ExerciseLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    date: {
      type: Date,
      index: true,
    },

    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
    },

    sets: Number,

    durationMinutes: Number,

    caloriesBurned: Number,
  },
  { timestamps: true },
);

ExerciseLogSchema.index({ userId: 1, date: 1 });

const ExerciseLog =
  mongoose.models.ExerciseLog ||
  mongoose.model("ExerciseLog", ExerciseLogSchema);

export default ExerciseLog;
