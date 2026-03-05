"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import MealSidebar from "../../components/Meals/meal-sidebar";
import MealLog from "../../components/Meals/meal-log";
import DailySummary from "../../components/Meals/daily-summary";
import MacrosCard from "../../components/Meals/macros-card";
import AiSuggestion from "../../components/Meals/ai-suggestionBox";

export default function MealLogPage() {
  const { user, isLoaded } = useUser();
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  const [mealData, setMealData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile for goals
  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile();
    }
  }, [isLoaded, user]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (!response.ok) {
        console.warn("Profile fetch returned", response.status);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleMealUpdate = (data) => {
    setMealData(data);
  };

  // Calculate calories per meal type
  const mealCalories = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
  };

  if (mealData?.meals) {
    Object.keys(mealCalories).forEach((mealType) => {
      mealCalories[mealType] =
        mealData.meals[mealType]?.reduce(
          (sum, entry) => sum + (entry.nutritionConsumed?.calories || 0),
          0,
        ) || 0;
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-6">Today's Meals</h1>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr_320px]">
        {/* LEFT - Meal Selector */}
        <div className="space-y-6">
          <MealSidebar
            selectedMeal={selectedMeal}
            setSelectedMeal={setSelectedMeal}
            mealCalories={mealCalories}
          />
          <AiSuggestion />
        </div>

        {/* CENTER - Meal Log */}
        <MealLog selectedMeal={selectedMeal} onMealUpdate={handleMealUpdate} />

        {/* RIGHT - Analytics */}
        <div className="space-y-6">
          <DailySummary
            totals={mealData?.totals}
            userGoal={userProfile?.goals?.dailyCalorieTarget}
          />
          <MacrosCard
            totals={mealData?.totals}
            userGoals={{
              protein: 65,
              carbs: 310,
              fat: 67,
            }}
          />
        </div>
      </div>
    </div>
  );
}
