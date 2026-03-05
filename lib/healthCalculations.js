/**
 * Health calculations utility functions for BMI, BMR, TDEE, and macro targets
 */

/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @returns {number} BMI value
 */
export function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {string} Category string
 */
export function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR in calories
 */
export function calculateBMR(weightKg, heightCm, age, gender) {
  // Mifflin-St Jeor Equation
  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;

  if (gender === "male") {
    return Math.round(baseBMR + 5);
  } else {
    return Math.round(baseBMR - 161);
  }
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Activity level string
 * @returns {number} TDEE in calories
 */
export function calculateTDEE(bmr, activityLevel) {
  const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Heavy exercise 6-7 days/week
  };

  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate daily calorie target based on goal
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goalType - Goal type string
 * @returns {number} Daily calorie target
 */
export function calculateCalorieTarget(tdee, goalType) {
  const adjustments = {
    lose_weight: -500, // 0.5 kg per week loss
    gain_weight: 500, // 0.5 kg per week gain
    maintain: 0,
    build_muscle: 300, // Slight surplus for muscle building
  };

  const adjustment = adjustments[goalType] || 0;
  return Math.round(tdee + adjustment);
}

/**
 * Calculate macro targets based on goal
 * @param {number} calories - Daily calorie target
 * @param {string} goalType - Goal type string
 * @returns {{ protein: number, carbs: number, fat: number }} Object with protein, carbs, and fat in grams
 */
export function calculateMacroTargets(calories, goalType) {
  // Macro percentages based on goal
  const macroProfiles = {
    lose_weight: { protein: 0.4, carbs: 0.3, fat: 0.3 },
    gain_weight: { protein: 0.3, carbs: 0.45, fat: 0.25 },
    maintain: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    build_muscle: { protein: 0.35, carbs: 0.4, fat: 0.25 },
  };

  const profile = macroProfiles[goalType] || macroProfiles.maintain;

  // Calculate grams (protein = 4 cal/g, carbs = 4 cal/g, fat = 9 cal/g)
  return {
    protein: Math.round((calories * profile.protein) / 4),
    carbs: Math.round((calories * profile.carbs) / 4),
    fat: Math.round((calories * profile.fat) / 9),
  };
}

/**
 * Calculate recommended daily water intake
 * @param {number} weightKg - Weight in kilograms
 * @param {string} activityLevel - Activity level string
 * @returns {number} Water in liters
 */
export function calculateWaterIntake(weightKg, activityLevel) {
  // Base: 30-35 ml per kg body weight
  let baseWater = weightKg * 0.033; // ~33ml per kg in liters

  // Activity adjustment
  const activityAdjustments = {
    sedentary: 0,
    light: 0.3,
    moderate: 0.5,
    active: 0.8,
  };

  const adjustment = activityAdjustments[activityLevel] || 0;
  return Number((baseWater + adjustment).toFixed(1));
}

/**
 * Calculate age from date of birth
 * @param {Date} dob - Date of birth
 * @returns {number} Age in years
 */
export function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Validate health metrics
 * @param {{ weightKg?: number, heightCm?: number, age?: number }} metrics - Health metrics object
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateHealthMetrics(metrics) {
  const errors = [];

  if (metrics.weightKg !== undefined) {
    if (metrics.weightKg < 20 || metrics.weightKg > 300) {
      errors.push("Weight must be between 20 and 300 kg");
    }
  }

  if (metrics.heightCm !== undefined) {
    if (metrics.heightCm < 100 || metrics.heightCm > 250) {
      errors.push("Height must be between 100 and 250 cm");
    }
  }

  if (metrics.age !== undefined) {
    if (metrics.age < 13 || metrics.age > 120) {
      errors.push("Age must be between 13 and 120 years");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
