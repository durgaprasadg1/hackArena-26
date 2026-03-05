import React from 'react';
import { Utensils, Activity, Trophy } from 'lucide-react';

const ActivityTimeline = () => {
  const activities = [
    {
      id: 1,
      type: 'meal',
      title: 'Logged Grilled Chicken Salad',
      time: '2h ago',
      icon: Utensils,
      iconBg: 'bg-green-500',
    },
    {
      id: 2,
      type: 'exercise',
      title: 'Completed Morning Jog (3 miles)',
      time: '5h ago',
      icon: Activity,
      iconBg: 'bg-blue-500',
    },
    {
      id: 3,
      type: 'goal',
      title: 'Hit your weekly Protein Goal!',
      time: 'Yesterday',
      icon: Trophy,
      iconBg: 'bg-yellow-500',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
      <div className="space-y-8 relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100" />

        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center z-10 ring-4 ring-white`}>
              <activity.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {activity.type === 'meal' && 'Logged '}
                {activity.type === 'exercise' && 'Completed '}
                <span className="font-semibold text-gray-900">{activity.title}</span>
                {activity.type === 'goal' && ''}
              </p>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
