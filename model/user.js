import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Clerk Integration
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: function () {
        // Password only required if not using Clerk
        return !this.clerkId;
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    roleType: {
      type: String,
      enum: ["student", "working_professional", "business_leader", "other"],
    },

    // Onboarding status
    onboarded: {
      type: Boolean,
      default: false,
    },

    profilePicture: String,

    profile: {
      gender: String,
      dob: {
        type: Date,
        index: true,
      },
      heightCm: Number,
      weightKg: Number,

      activityLevel: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active"],
      },
    },

    healthMetrics: {
      bmi: Number,
      bmr: Number,
    },

    lifestyle: {
      sleepHours: Number,
      waterIntakeLiters: Number,
    },

    goals: {
      goalType: {
        type: String,
        enum: ["lose_weight", "gain_weight", "maintain", "build_muscle"],
      },

      targetWeight: Number,

      dailyCalorieTarget: Number,
    },

    // User Preferences
    preferences: {
      dietaryRestrictions: [
        {
          type: String,
          enum: [
            "vegetarian",
            "vegan",
            "gluten-free",
            "dairy-free",
            "nut-free",
            "halal",
            "kosher",
            "none",
          ],
        },
      ],

      allergies: [String],

      cuisinePreferences: [
        {
          type: String,
          enum: [
            "indian",
            "chinese",
            "italian",
            "mexican",
            "american",
            "mediterranean",
            "thai",
            "japanese",
            "other",
          ],
        },
      ],

      equipmentAccess: [
        {
          type: String,
          enum: ["gym", "home", "outdoor", "none"],
        },
      ],

      notificationSettings: {
        email: { type: Boolean, default: true },
        mealReminders: { type: Boolean, default: true },
        waterReminders: { type: Boolean, default: true },
        exerciseReminders: { type: Boolean, default: true },
      },
    },

    // Streak Tracking
    streak: {
      current: {
        type: Number,
        default: 0,
      },
      longest: {
        type: Number,
        default: 0,
      },
      lastLoggedDate: Date,
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Indexes to speed role and profile lookups
UserSchema.index({ role: 1 });
UserSchema.index({ clerkId: 1 });
UserSchema.index({ onboarded: 1 });
UserSchema.index({ lastActive: -1 });

const User = mongoose.model("User", UserSchema);

export default User;
