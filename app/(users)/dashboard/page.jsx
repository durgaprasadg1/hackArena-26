"use client";

import React from "react";
import MacroCard from "../../components/Dashboard/MacroCard";
import QuickLog from "../../components/Dashboard/QuickLog";
import ActivityTimeline from "../../components/Dashboard/ActivityTimeline";
import AIInsights from "../../components/Dashboard/AIInsights";
import SuggestedMeal from "../../components/Dashboard/SuggestedMeal";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#F8FAF5] font-sans text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Good morning, Alex!
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
                label="Calories"
                value="1,450"
                target="2,200"
                unit="kcal"
                isCalories={true}
              />

              <MacroCard
                label="Protein"
                value="85"
                unit="g"
                color="#3B82F6"
                progress={60}
              />

              <MacroCard
                label="Carbs"
                value="120"
                unit="g"
                color="#EAB308"
                progress={45}
              />

              <MacroCard
                label="Fats"
                value="45"
                unit="g"
                color="#EF4444"
                progress={80}
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
              <ActivityTimeline />
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