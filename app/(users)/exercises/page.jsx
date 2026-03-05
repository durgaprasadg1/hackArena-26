"use client"
import { Dumbbell, Plus, Trash2, Zap, Timer, Activity } from 'lucide-react';
import { motion } from "framer-motion";
const Exercise = () => {
  const todayWorkouts = [
    { id: 1, name: 'Barbell Squats', sets: 4, reps: 12, kcal: 180, icon: Dumbbell, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 2, name: 'Bench Press', sets: 3, reps: 10, kcal: 120, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, name: 'Treadmill Run', duration: '15 mins', zone: 'Zone 3', kcal: 150, icon: Timer, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const exploreExercises = [
    { id: 1, name: 'Dumbbell Lunges', level: 'BEGINNER', category: 'Legs & Core', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop', badgeColor: 'bg-emerald-500' },
    { id: 2, name: 'Deadlifts', level: 'INTERMEDIATE', category: 'Full Body', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', badgeColor: 'bg-orange-500' },
    { id: 3, name: 'Kettlebell Snatch', level: 'ADVANCED', category: 'Power & Endurance', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop', badgeColor: 'bg-red-500' },
    { id: 4, name: 'Weighted Pull Ups', level: 'INTERMEDIATE', category: 'Back & Arms', img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop', badgeColor: 'bg-orange-500' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Today's Workout & Balancing Act */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Today's Workout</h2>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">ACTIVE</span>
            </div>
            
            <div className="space-y-4">
              {todayWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${workout.bg} rounded-xl flex items-center justify-center`}>
                      <workout.icon className={`w-5 h-5 ${workout.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{workout.name}</h3>
                      <p className="text-[11px] text-gray-400">
                        {workout.sets ? `${workout.sets} sets • ${workout.reps} reps` : `${workout.duration} • ${workout.zone}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[11px] font-bold text-orange-500">{workout.kcal} kcal</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-3 bg-[#10B981] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#059669] transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Add Exercise
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#F1F4EA] rounded-2xl p-6 border border-[#10B981]/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-gray-900">Balancing Act</h2>
            </div>
            <p className="text-xs text-gray-600 mb-4">You consumed 250 extra kcal at lunch. Burn it off with:</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl">
                <span className="text-xs font-medium text-gray-700">High Intensity Burpees</span>
                <span className="text-xs font-bold text-[#10B981]">12 mins</span>
              </div>
              <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl">
                <span className="text-xs font-medium text-gray-700">Jump Rope Sprints</span>
                <span className="text-xs font-bold text-[#10B981]">15 mins</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center: Explore Exercises */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Explore Exercises</h2>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full hover:bg-gray-200 transition-colors">All</button>
              <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-full hover:bg-gray-50 transition-colors">Strength</button>
              <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-full hover:bg-gray-50 transition-colors">Cardio</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exploreExercises.map((ex, idx) => (
              <motion.div 
                key={ex.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
              >
                <div className="relative h-48">
                  <img 
                    src={ex.img} 
                    alt={ex.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute top-4 left-4 ${ex.badgeColor} text-white text-[9px] font-bold px-2 py-1 rounded-md`}>
                    {ex.level}
                  </span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{ex.name}</h3>
                    <p className="text-xs text-gray-400">{ex.category}</p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Analytics & Tips */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-6">Exercise Analytics</h2>
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-100 stroke-current"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#10B981] stroke-current"
                  strokeWidth="3"
                  strokeDasharray="75, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">450</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">BURNED</span>
              </div>
            </div>
            <div className="flex justify-between text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-gray-600">Burned: 450</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-200" />
                <span className="text-gray-400">Target: 600</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-900">Session Summary</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase">TODAY</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Duration</p>
                <p className="text-lg font-bold text-[#10B981]">45m</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Exercises</p>
                <p className="text-lg font-bold text-orange-500">3</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0F172A] rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-[#10B981]/20 rounded-md flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
              <h2 className="text-sm font-bold text-white">AI Training Tip</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              "Your recovery rate is 15% faster after strength sessions today. Consider adding a light 10-minute stretch to maximize muscle protein synthesis tonight."
            </p>
            <button className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider flex items-center gap-2 hover:text-[#34D399] transition-colors">
              READ MORE INSIGHTS
              <Plus className="w-3 h-3 rotate-45" />
            </button>
          </motion.div>
        </div>

      </div>
    </main>
  );
};

export default Exercise;
