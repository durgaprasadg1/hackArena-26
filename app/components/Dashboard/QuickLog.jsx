import React from 'react';
import { Plus, Edit2, Droplets, Moon } from 'lucide-react';

const QuickLog = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Daily Quick Log</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water Intake */}
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Water Intake</h3>
              <p className="text-xs text-gray-500">4 / 8 Glasses</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Sleep */}
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Moon className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Sleep</h3>
              <p className="text-xs text-gray-500">6h 30m logged</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickLog;
