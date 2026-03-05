"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import MacroCard from "../../components/Dashboard/MacroCard";
import QuickLog from "../../components/Dashboard/QuickLog";
import ActivityTimeline from "../../components/Dashboard/ActivityTimeline";
import AIInsights from "../../components/Dashboard/AIInsights";
import SuggestedMeal from "../../components/Dashboard/SuggestedMeal";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) {
        console.log("Dashboard stats API error:", res.status);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setDashboardData(data);
      } else {
        console.log("Expected JSON but got:", contentType);
      }
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = dashboardData?.user?.name || user?.firstName || "there";

  if (loading) {
    return (
      <div className="min-h-screen font-sans text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            {getGreeting()}, {userName}!
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Ready to hit your goals today? Let's make it count.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Macros */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <MacroCard
                label="Net Calories"
                value={Math.max(
                  0,
                  (dashboardData?.macros?.calories?.consumed || 0) -
                    (dashboardData?.macros?.calories?.burned || 0),
                )}
                target={dashboardData?.macros?.calories?.target || 2000}
                unit="kcal"
                isCalories={true}
                consumed={dashboardData?.macros?.calories?.consumed || 0}
                burned={dashboardData?.macros?.calories?.burned || 0}
              />

              <MacroCard
                label="Protein"
                value={dashboardData?.macros?.protein?.consumed || 0}
                unit="g"
                target={dashboardData?.macros?.protein?.target || 150}
                color="#3B82F6"
              />

              <MacroCard
                label="Carbs"
                value={dashboardData?.macros?.carbs?.consumed || 0}
                unit="g"
                target={dashboardData?.macros?.carbs?.target || 200}
                color="#EAB308"
              />

              <MacroCard
                label="Fats"
                value={dashboardData?.macros?.fat?.consumed || 0}
                unit="g"
                target={dashboardData?.macros?.fat?.target || 67}
                color="#EF4444"
              />
            </motion.div>

            {/* Quick Log */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <QuickLog />
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ActivityTimeline activities={dashboardData?.activities || []} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AIInsights />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <SuggestedMeal />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
