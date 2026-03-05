import React from 'react';

const SuggestedMeal = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested Meals</h2>
      <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-4 group">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP35u8JJGovYpyrlyT8Z1vz1d4qkMmKLuUJpbnRBg1BQxBs53nsAogyBynV2_WLoBF3F41IshUFow-OJQ4LYiZrlvcSg-EcgVldq4vhQ2meV5py3JJhgxNf5UwloSrJkwvsSZNwcEsIb8fZHfUb83nc0BuK68rHcrdQWfglsDWfFm8HFA2YnwyuvtK_2YvKL6mvSTbancKlRr-0YKU3hb8dsm_QHReHnZ-KkY9437yjsIRqBSCqKCsn7BpGEroy7SIgrIWe_5mmuU" 
          alt="Buddha Bowl"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
          <span className="text-white font-bold text-lg">Buddha Bowl</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">
        A perfect balance of your macros to help hit your daily target.
      </p>
    </div>
  );
};

export default SuggestedMeal;
