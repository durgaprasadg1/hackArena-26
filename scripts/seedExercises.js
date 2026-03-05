/**
 * Seed verified exercises into the database
 * Run with: node scripts/seedExercises.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const MONGO_URI = process.env.MONGO_URI;

const ExerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
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
      verified: { type: Boolean, default: false },
    },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Exercise =
  mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);

const exercises = [
  // CARDIO
  {
    name: "Running (moderate)",
    type: "cardio",
    caloriesPerMinute: 10,
    muscleGroups: ["quadriceps", "hamstrings", "calves"],
    difficulty: "beginner",
    description:
      "Steady-state moderate pace run. Great for cardiovascular health.",
  },
  {
    name: "Cycling (stationary)",
    type: "cardio",
    caloriesPerMinute: 8,
    muscleGroups: ["quadriceps", "glutes", "calves"],
    difficulty: "beginner",
    description: "Low-impact cardio on stationary bike.",
  },
  {
    name: "Jump Rope",
    type: "cardio",
    caloriesPerMinute: 12,
    muscleGroups: ["calves", "core", "shoulders"],
    difficulty: "intermediate",
    description: "High-intensity skipping rope workout.",
  },
  {
    name: "Swimming (laps)",
    type: "cardio",
    caloriesPerMinute: 9,
    muscleGroups: ["full body"],
    difficulty: "beginner",
    description: "Full body low-impact cardio in the pool.",
  },
  {
    name: "HIIT Sprint Intervals",
    type: "cardio",
    caloriesPerMinute: 14,
    muscleGroups: ["quadriceps", "hamstrings", "glutes"],
    difficulty: "advanced",
    description: "Alternating high-intensity sprints with short rest periods.",
  },
  {
    name: "Walking (brisk)",
    type: "cardio",
    caloriesPerMinute: 5,
    muscleGroups: ["glutes", "hamstrings", "calves"],
    difficulty: "beginner",
    description: "Brisk walking, excellent for beginners and active recovery.",
  },
  {
    name: "Elliptical Trainer",
    type: "cardio",
    caloriesPerMinute: 7,
    muscleGroups: ["quadriceps", "glutes", "core"],
    difficulty: "beginner",
    description: "Low-impact full body cardio machine.",
  },
  {
    name: "Rowing Machine",
    type: "cardio",
    caloriesPerMinute: 11,
    muscleGroups: ["back", "biceps", "core", "glutes"],
    difficulty: "intermediate",
    description: "Full body cardio on the rowing machine.",
  },
  // STRENGTH
  {
    name: "Barbell Back Squat",
    type: "strength",
    caloriesPerSet: 20,
    muscleGroups: ["quadriceps", "glutes", "hamstrings", "core"],
    difficulty: "intermediate",
    description:
      "The king of lower body exercises. Barbell on upper back, squat to parallel.",
  },
  {
    name: "Deadlift",
    type: "strength",
    caloriesPerSet: 22,
    muscleGroups: ["back", "glutes", "hamstrings", "core"],
    difficulty: "intermediate",
    description: "Hinge-pattern lift engaging the entire posterior chain.",
  },
  {
    name: "Bench Press",
    type: "strength",
    caloriesPerSet: 15,
    muscleGroups: ["chest", "triceps", "shoulders"],
    difficulty: "intermediate",
    description: "Horizontal push on a flat bench with barbell or dumbbells.",
  },
  {
    name: "Pull Ups",
    type: "strength",
    caloriesPerSet: 12,
    muscleGroups: ["back", "biceps", "core"],
    difficulty: "intermediate",
    description:
      "Bodyweight vertical pull. Excellent for back and arm development.",
  },
  {
    name: "Overhead Press",
    type: "strength",
    caloriesPerSet: 14,
    muscleGroups: ["shoulders", "triceps", "core"],
    difficulty: "intermediate",
    description: "Standing barbell press overhead.",
  },
  {
    name: "Dumbbell Lunges",
    type: "strength",
    caloriesPerSet: 10,
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    difficulty: "beginner",
    description: "Walking or stationary lunges holding dumbbells.",
  },
  {
    name: "Dumbbell Bicep Curl",
    type: "strength",
    caloriesPerSet: 7,
    muscleGroups: ["biceps"],
    difficulty: "beginner",
    description: "Isolation curl for the biceps muscle.",
  },
  {
    name: "Tricep Dips",
    type: "strength",
    caloriesPerSet: 9,
    muscleGroups: ["triceps", "chest", "shoulders"],
    difficulty: "beginner",
    description: "Bodyweight dips on parallel bars or a bench.",
  },
  {
    name: "Bent Over Row",
    type: "strength",
    caloriesPerSet: 16,
    muscleGroups: ["back", "biceps", "core"],
    difficulty: "intermediate",
    description: "Barbell or dumbbell row for mid-back development.",
  },
  {
    name: "Romanian Deadlift",
    type: "strength",
    caloriesPerSet: 18,
    muscleGroups: ["hamstrings", "glutes", "back"],
    difficulty: "intermediate",
    description:
      "Hip-hinge focusing on hamstring stretch and glute activation.",
  },
  {
    name: "Bulgarian Split Squat",
    type: "strength",
    caloriesPerSet: 15,
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    difficulty: "advanced",
    description: "Rear-elevated split squat for single-leg strength.",
  },
  // FLEXIBILITY
  {
    name: "Yoga Sun Salutation",
    type: "flexibility",
    caloriesPerMinute: 3,
    muscleGroups: ["full body"],
    difficulty: "beginner",
    description: "Classic yoga flow linking breath with movement.",
  },
  {
    name: "Hip Flexor Stretch",
    type: "flexibility",
    caloriesPerMinute: 2,
    muscleGroups: ["glutes", "quadriceps"],
    difficulty: "beginner",
    description: "Kneeling lunge stretch to open hip flexors.",
  },
  {
    name: "Hamstring Stretch",
    type: "flexibility",
    caloriesPerMinute: 2,
    muscleGroups: ["hamstrings"],
    difficulty: "beginner",
    description: "Seated or standing stretch targeting the hamstrings.",
  },
  // FUNCTIONAL
  {
    name: "Burpees",
    type: "functional",
    caloriesPerMinute: 11,
    muscleGroups: ["full body"],
    difficulty: "intermediate",
    description:
      "Full body explosive movement combining squat thrust and jump.",
  },
  {
    name: "Kettlebell Swing",
    type: "functional",
    caloriesPerSet: 12,
    muscleGroups: ["glutes", "hamstrings", "back", "core"],
    difficulty: "intermediate",
    description: "Hip-driven swing with kettlebell, ballistic in nature.",
  },
  {
    name: "Box Jumps",
    type: "functional",
    caloriesPerSet: 14,
    muscleGroups: ["quadriceps", "glutes", "calves"],
    difficulty: "intermediate",
    description: "Explosive plyometric jump onto a box or platform.",
  },
  {
    name: "Battle Ropes",
    type: "functional",
    caloriesPerMinute: 10,
    muscleGroups: ["shoulders", "core", "back"],
    difficulty: "intermediate",
    description:
      "Heavy rope waves — great for conditioning and shoulder endurance.",
  },
  // BALANCE
  {
    name: "Single Leg Deadlift",
    type: "balance",
    caloriesPerSet: 10,
    muscleGroups: ["hamstrings", "glutes", "core"],
    difficulty: "intermediate",
    description:
      "Single-leg hinge pattern that challenges balance and stability.",
  },
  {
    name: "Bosu Ball Squat",
    type: "balance",
    caloriesPerSet: 9,
    muscleGroups: ["quadriceps", "glutes", "core"],
    difficulty: "beginner",
    description: "Squat on a Bosu ball to challenge proprioception.",
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  let added = 0;
  let skipped = 0;

  for (const ex of exercises) {
    const exists = await Exercise.findOne({
      name: { $regex: `^${ex.name}$`, $options: "i" },
    });
    if (exists) {
      skipped++;
      continue;
    }
    await Exercise.create({ ...ex, verification: { verified: true } });
    added++;
  }

  console.log(`✅ Seeded: ${added} added, ${skipped} already existed`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
