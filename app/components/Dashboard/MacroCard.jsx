import React from "react";

const MacroCard = ({ label, value, target, unit, color, isCalories }) => {
  // Calculate progress percentage
  const progress = target > 0 ? Math.min(100, (value / target) * 100) : 0;

  // Format numbers with commas
  const formatNumber = (num) => {
    return Math.round(num).toLocaleString();
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden ${isCalories ? "ring-2 ring-[#556B2F] ring-offset-0" : ""}`}
    >
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900">
          {formatNumber(value)}
        </span>
        {unit && (
          <span className="text-sm font-medium text-gray-500">{unit}</span>
        )}
      </div>
      {target && (
        <span className="text-[10px] text-gray-400 mt-1">
          / {formatNumber(target)} {unit}
        </span>
      )}

      {!isCalories && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
      )}

      {isCalories && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
          <div
            className="h-full bg-[#556B2F] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default MacroCard;
