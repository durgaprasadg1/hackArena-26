"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ExerciseSidebar from "../../components/Exercise/exercise-sidebar";
import ExerciseLog from "../../components/Exercise/exercise-log";
import ExerciseSummary from "../../components/Exercise/exercise-summary";
import ExerciseStatsCard from "../../components/Exercise/exercise-stats-card";

export default function ExercisePage() {
  const { user, isLoaded } = useUser();
  const [logData, setLogData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

 useEffect(() => {
  if (!isLoaded || !user) return;

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");

      if (!res.ok) {
        console.log("Failed to fetch profile");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  fetchUserProfile();
}, [isLoaded, user]);

  const handleLogUpdate = (data) => {
    setLogData(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-6">Today's Workout</h1>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr_300px]">
        {/* LEFT - Category & Difficulty Filters */}
        <ExerciseSidebar
          filterType={filterType}
          setFilterType={setFilterType}
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
        />

        {/* CENTER - Exercise Log */}
        <ExerciseLog
          onLogUpdate={handleLogUpdate}
          filterType={filterType}
          filterDifficulty={filterDifficulty}
        />

        {/* RIGHT - Analytics */}
        <div className="space-y-6">
          <ExerciseSummary
            totals={logData?.totals}
            calorieGoal={userProfile?.goals?.dailyCalorieTarget
              ? Math.round(userProfile.goals.dailyCalorieTarget * 0.25)
              : 500}
          />
          <ExerciseStatsCard logs={logData?.logs || []} />
        </div>
      </div>
    </div>
  );
}
