/**
 * USDA FoodData Central API Service
 * Official US Government nutrition database with 1M+ foods
 * FREE with no rate limits!
 *
 * API Documentation: https://fdc.nal.usda.gov/api-guide.html
 * Get API Key: https://fdc.nal.usda.gov/api-key-signup.html
 */

import axios from "axios";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";
const API_KEY = process.env.USDA_API_KEY || "DEMO_KEY";

/**
 * Search for foods in USDA database
 * @param {string} query - Search term (e.g., "apple", "chicken breast")
 * @param {object} options - Search options
 * @returns {Promise<Array>} - Array of food items
 */
export async function searchFoods(query, options = {}) {
  try {
    const {
      pageSize = 25,
      pageNumber = 1,
      dataType = ["Foundation", "SR Legacy", "Branded"], // Food data types
      sortBy = "dataType.keyword",
      sortOrder = "asc",
    } = options;

    const response = await axios.post(
      `${USDA_BASE_URL}/foods/search`,
      {
        query,
        dataType,
        pageSize,
        pageNumber,
        sortBy,
        sortOrder,
      },
      {
        params: { api_key: API_KEY },
        headers: { "Content-Type": "application/json" },
      },
    );

    const foods = response.data.foods || [];

    // Transform USDA format to our app format
    return foods.map((food) => ({
      fdcId: food.fdcId,
      name: food.description,
      brand: food.brandOwner || food.brandName || null,
      dataType: food.dataType,
      calories: getNutrient(food, "Energy", "kcal"),
      protein: getNutrient(food, "Protein"),
      carbs: getNutrient(food, "Carbohydrate, by difference"),
      fat: getNutrient(food, "Total lipid (fat)"),
      fiber: getNutrient(food, "Fiber, total dietary"),
      sugar: getNutrient(food, "Sugars, total including NLEA"),
      sodium: getNutrient(food, "Sodium"),
      servingSize: food.servingSize || 100,
      servingUnit: food.servingSizeUnit || "g",
      category: food.foodCategory || food.brandedFoodCategory || "Unknown",
    }));
  } catch (error) {
    console.error("USDA Search Error:", error.response?.data || error.message);
    throw new Error("Failed to search foods from USDA database");
  }
}

/**
 * Get detailed food information by FDC ID
 * @param {number} fdcId - USDA FoodData Central ID
 * @returns {Promise<Object>} - Detailed food information
 */
export async function getFoodDetails(fdcId) {
  try {
    const response = await axios.get(`${USDA_BASE_URL}/food/${fdcId}`, {
      params: {
        api_key: API_KEY,
        format: "full",
      },
    });

    const food = response.data;

    return {
      fdcId: food.fdcId,
      name: food.description,
      brand: food.brandOwner || food.brandName || null,
      dataType: food.dataType,
      category: food.foodCategory || food.brandedFoodCategory || "Unknown",
      ingredients: food.ingredients || null,
      servingSize: food.servingSize || 100,
      servingUnit: food.servingSizeUnit || "g",
      householdServingText: food.householdServingFullText || null,

      // Macronutrients
      calories: getNutrient(food, "Energy", "kcal"),
      protein: getNutrient(food, "Protein"),
      carbs: getNutrient(food, "Carbohydrate, by difference"),
      fat: getNutrient(food, "Total lipid (fat)"),
      fiber: getNutrient(food, "Fiber, total dietary"),
      sugar: getNutrient(food, "Sugars, total including NLEA"),

      // Vitamins & Minerals
      vitaminA: getNutrient(food, "Vitamin A, RAE", "µg"),
      vitaminC: getNutrient(food, "Vitamin C, total ascorbic acid"),
      vitaminD: getNutrient(food, "Vitamin D (D2 + D3)", "µg"),
      calcium: getNutrient(food, "Calcium, Ca"),
      iron: getNutrient(food, "Iron, Fe"),
      potassium: getNutrient(food, "Potassium, K"),
      sodium: getNutrient(food, "Sodium, Na"),

      // Full nutrient list
      nutrients:
        food.foodNutrients?.map((n) => ({
          name: n.nutrient?.name || "Unknown",
          amount: n.amount || 0,
          unit: n.nutrient?.unitName || "g",
        })) || [],
    };
  } catch (error) {
    console.error("USDA Details Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch food details from USDA");
  }
}

/**
 * Get multiple foods by their FDC IDs
 * @param {Array<number>} fdcIds - Array of FDC IDs
 * @returns {Promise<Array>} - Array of food details
 */
export async function getFoodsByIds(fdcIds) {
  try {
    const response = await axios.post(
      `${USDA_BASE_URL}/foods`,
      { fdcIds },
      {
        params: { api_key: API_KEY },
        headers: { "Content-Type": "application/json" },
      },
    );

    return response.data.map((food) => ({
      fdcId: food.fdcId,
      name: food.description,
      calories: getNutrient(food, "Energy", "kcal"),
      protein: getNutrient(food, "Protein"),
      carbs: getNutrient(food, "Carbohydrate, by difference"),
      fat: getNutrient(food, "Total lipid (fat)"),
      servingSize: food.servingSize || 100,
      servingUnit: food.servingSizeUnit || "g",
    }));
  } catch (error) {
    console.error("USDA Batch Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch multiple foods from USDA");
  }
}

/**
 * Helper function to extract nutrient value from USDA food object
 * @param {Object} food - USDA food object
 * @param {string} nutrientName - Name of nutrient to extract
 * @param {string} unit - Expected unit (default: 'g')
 * @returns {number} - Nutrient amount
 */
function getNutrient(food, nutrientName, unit = "g") {
  if (!food.foodNutrients) return 0;

  const nutrient = food.foodNutrients.find((n) => {
    const name = n.nutrient?.name || n.nutrientName || "";
    const matchesName = name.toLowerCase().includes(nutrientName.toLowerCase());
    const matchesUnit = unit
      ? (n.nutrient?.unitName || n.unitName) === unit
      : true;
    return matchesName && matchesUnit;
  });

  return nutrient?.amount || nutrient?.value || 0;
}

/**
 * Map USDA food data to our Food model schema
 * @param {Object} usdaFood - Food data from USDA API
 * @returns {Object} - Food object compatible with our database schema
 */
export function mapToFoodModel(usdaFood) {
  return {
    name: usdaFood.description,
    brand: usdaFood.brandOwner || usdaFood.brandName || null,
    calories: getNutrient(usdaFood, "Energy", "kcal"),
    protein: getNutrient(usdaFood, "Protein"),
    carbs: getNutrient(usdaFood, "Carbohydrate, by difference"),
    fat: getNutrient(usdaFood, "Total lipid (fat)"),
    fiber: getNutrient(usdaFood, "Fiber, total dietary"),
    sugar: getNutrient(usdaFood, "Sugars, total including NLEA"),
    sodium: getNutrient(usdaFood, "Sodium, Na"),
    servingSize: usdaFood.servingSize || 100,
    servingUnit: usdaFood.servingSizeUnit || "g",
    category:
      usdaFood.foodCategory || usdaFood.brandedFoodCategory || "General",
    isVerifiedByAdmin: true, // USDA data is pre-verified
    source: "USDA FoodData Central",
    externalId: `usda_${usdaFood.fdcId}`,
    barcode: usdaFood.gtinUpc || null,
    imageUrl: null, // USDA doesn't provide images
    tags: [usdaFood.dataType],
  };
}

/**
 * Search Indian/local foods (wrapper for better Indian food search)
 * @param {string} query - Hindi or English search term
 * @returns {Promise<Array>} - Array of food items
 */
export async function searchIndianFoods(query) {
  // Map common Hindi/Indian terms to English equivalents for better USDA search
  const indianFoodMappings = {
    dal: "lentils",
    daal: "lentils",
    roti: "whole wheat flatbread",
    chapati: "whole wheat flatbread",
    naan: "flatbread",
    paratha: "flatbread",
    paneer: "cottage cheese",
    dahi: "yogurt",
    chawal: "rice",
    aloo: "potato",
    gobi: "cauliflower",
    palak: "spinach",
    rajma: "kidney beans",
    chana: "chickpeas",
    masala: "spiced",
    curry: "curry",
    sabzi: "vegetable",
    biryani: "rice",
    samosa: "pastry",
    pakora: "fritter",
  };

  // Convert query to lowercase for mapping
  const lowerQuery = query.toLowerCase();
  const mappedQuery = indianFoodMappings[lowerQuery] || query;

  return searchFoods(mappedQuery, { pageSize: 25 });
}

/**
 * Calculate nutrition for a portion different from serving size
 * @param {Object} food - Food object with nutrition per serving
 * @param {number} quantity - Quantity consumed
 * @param {string} unit - Unit of quantity (g, oz, cups, etc.)
 * @returns {Object} - Calculated nutrition values
 */
export function calculatePortionNutrition(food, quantity, unit = "g") {
  // Convert to grams if needed
  let quantityInGrams = quantity;

  if (unit !== "g") {
    const conversionRates = {
      oz: 28.35,
      lb: 453.592,
      kg: 1000,
      cup: 240,
      tbsp: 15,
      tsp: 5,
    };
    quantityInGrams = quantity * (conversionRates[unit] || 1);
  }

  // Calculate ratio based on serving size
  const ratio = quantityInGrams / (food.servingSize || 100);

  return {
    calories: Math.round((food.calories || 0) * ratio),
    protein: Math.round((food.protein || 0) * ratio * 10) / 10,
    carbs: Math.round((food.carbs || 0) * ratio * 10) / 10,
    fat: Math.round((food.fat || 0) * ratio * 10) / 10,
    fiber: Math.round((food.fiber || 0) * ratio * 10) / 10,
    sugar: Math.round((food.sugar || 0) * ratio * 10) / 10,
    sodium: Math.round((food.sodium || 0) * ratio),
  };
}

/**
 * Get food suggestions based on remaining macros
 * @param {Object} remainingMacros - Remaining calories, protein, carbs, fat
 * @param {Array<string>} preferences - User dietary preferences
 * @returns {Promise<Array>} - Suggested foods
 */
export async function suggestFoodsByMacros(remainingMacros, preferences = []) {
  const suggestions = [];

  // High protein suggestions
  if (remainingMacros.protein > 20) {
    const proteinFoods = await searchFoods("chicken breast", { pageSize: 5 });
    suggestions.push(...proteinFoods);
  }

  // High carb suggestions
  if (remainingMacros.carbs > 40) {
    const carbFoods = await searchFoods("rice", { pageSize: 5 });
    suggestions.push(...carbFoods);
  }

  // Balanced meal suggestions
  if (remainingMacros.calories > 300) {
    const balancedFoods = await searchFoods("salad", { pageSize: 5 });
    suggestions.push(...balancedFoods);
  }

  return suggestions.slice(0, 10); // Return top 10 suggestions
}

export default {
  searchFoods,
  getFoodDetails,
  getFoodsByIds,
  mapToFoodModel,
  searchIndianFoods,
  calculatePortionNutrition,
  suggestFoodsByMacros,
};
