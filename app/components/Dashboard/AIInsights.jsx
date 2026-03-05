import React from 'react';
import { Lightbulb } from 'lucide-react';

const AIInsights = () => {
  return (
    <div className="bg-[#cff1cf] rounded-2xl p-6 border border-[#556B2F]/10">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-[#556B2F]" />
        <h2 className="text-lg font-bold text-gray-900">AI Insights</h2>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Based on your activity over the last 3 days, you tend to consume fewer calories in the morning. 
          Consider adding a protein-rich snack around 10 AM to maintain energy levels through your afternoon workouts.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#556B2F] mt-1.5 shrink-0" />
            Try Greek yogurt with almonds.
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#556B2F] mt-1.5 shrink-0" />
            A hard-boiled egg and a piece of fruit.
          </li>
        </ul>
        <button className="w-full mt-4 py-3 bg-[#556B2F] text-white rounded-xl font-semibold text-sm hover:bg-[#455826] transition-colors shadow-sm">
          View Detailed Analysis
        </button>
      </div>
    </div>
  );
};

export default AIInsights;
