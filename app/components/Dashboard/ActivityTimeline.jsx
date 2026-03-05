"use client";
import React from "react";
import { Utensils, Activity, Droplets } from "lucide-react";

const ActivityTimeline = ({ activities = [] }) => {
  const getTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "meal":
        return { icon: Utensils, bg: "bg-green-500" };
      case "exercise":
        return { icon: Activity, bg: "bg-blue-500" };
      default:
        return { icon: Droplets, bg: "bg-cyan-500" };
    }
  };

  const formatTitle = (activity) => {
    if (activity.type === "meal") {
      return `${activity.mealType.charAt(0).toUpperCase() + activity.mealType.slice(1)}: ${activity.title}`;
    }
    if (activity.type === "exercise") {
      return `${activity.title}${activity.duration ? ` (${activity.duration}min)` : ""}`;
    }
    return activity.title;
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Recent Activity
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No activities yet. Start logging your meals and exercises!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Recent Activity
      </h2>
      <div className="space-y-8 relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100" />

        {activities.map((activity, index) => {
          const { icon: Icon, bg } = getActivityIcon(activity.type);
          return (
            <div key={index} className="relative flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center z-10 ring-4 ring-white`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {formatTitle(activity)}
                  </span>
                </p>
                <span className="text-xs text-gray-400">
                  {getTimeAgo(activity.time)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
