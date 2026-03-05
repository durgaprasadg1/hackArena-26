import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  roleType: {
    type: String,
    enum: ["student", "working_professional", "business_leader", "other"]
  },

  profile: {
    gender: String,
    dob: Date,
    heightCm: Number,
    weightKg: Number,

    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active"]
    }
  },

  healthMetrics: {
    bmi: Number,
    bmr: Number
  },

  lifestyle: {
    sleepHours: Number,
    waterIntakeLiters: Number
  },

  goals: {
    goalType: {
      type: String,
      enum: ["lose_weight", "gain_weight", "maintain", "build_muscle"]
    },

    targetWeight: Number,

    dailyCalorieTarget: Number
  }

},
{ timestamps: true }
);

// Indexes to speed role and profile lookups
UserSchema.index({ role: 1 });
UserSchema.index({ "profile.dob": 1 });

const User = mongoose.model("User", UserSchema);

export default User;