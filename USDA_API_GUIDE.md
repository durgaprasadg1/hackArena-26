# USDA FoodData Central API - Quick Start Guide

## 🚀 Why USDA FoodData Central?

✅ **100% FREE** - No credit card, no payment ever  
✅ **No Rate Limits** - Unlimited API calls  
✅ **1,000,000+ Foods** - Comprehensive database  
✅ **Official US Gov API** - Trusted & maintained  
✅ **Branded + Raw Foods** - Perfect for all use cases

---

## 📝 Get Your Free API Key (30 seconds)

1. **Visit**: https://fdc.nal.usda.gov/api-key-signup.html

2. **Fill Simple Form**:
   - Email address
   - First name
   - Last name
   - Organization (can be "Personal" or "NutriSync AI")

3. **Get Instant Key**:
   - Key sent to your email immediately
   - Looks like: `abcdefghijklmnopqrstuvwxyz123456789`

4. **Add to `.env`**:
   ```env
   USDA_API_KEY=your_actual_key_here
   ```

---

## 🔧 Setup in NutriSync AI

### 1. Environment Setup ✅

Already configured in your `.env` file:

```env
USDA_API_KEY=DEMO_KEY  # Replace with your actual key
```

### 2. Service Created ✅

`services/usdaFoodService.js` is ready with:

- `searchFoods()` - Search by name
- `getFoodDetails()` - Get full nutrition
- `searchIndianFoods()` - Hindi/Indian food search
- `calculatePortionNutrition()` - Calculate portions
- `suggestFoodsByMacros()` - Smart suggestions

### 3. Indian Foods Database ✅

Pre-built seed script with 60+ common Indian foods:

```bash
node scripts/seedIndianFoods.js
```

This seeds:

- Breads: Roti, Naan, Paratha, Poori
- Dal: Tadka, Makhani, Rajma, Chana
- Sabzi: Aloo Gobi, Palak Paneer, Mix Veg
- Rice: Plain, Jeera, Biryani
- South Indian: Idli, Dosa, Vada
- Snacks: Samosa, Pakora, Vada Pav
- Sweets: Gulab Jamun, Rasgulla
- Beverages: Chai, Lassi

---

## 📊 API Features

### Search Foods

```javascript
import { searchFoods } from "@/services/usdaFoodService";

// Search any food
const results = await searchFoods("chicken breast");

// Search with options
const results = await searchFoods("apple", {
  pageSize: 25,
  dataType: ["Foundation", "Branded"],
});

// Response format:
[
  {
    fdcId: 747447,
    name: "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: 100,
    servingUnit: "g",
    category: "Poultry Products",
  },
];
```

### Get Food Details

```javascript
import { getFoodDetails } from '@/services/usdaFoodService';

const food = await getFoodDetails(747447); // FDC ID

// Returns complete nutrition:
{
  fdcId: 747447,
  name: "...",
  calories: 165,
  protein: 31,
  carbs: 0,
  fat: 3.6,
  // Plus vitamins, minerals, and 50+ nutrients
  vitaminA: 10,
  calcium: 15,
  iron: 1.04,
  nutrients: [...] // Full nutrient array
}
```

### Search Indian Foods

```javascript
import { searchIndianFoods } from "@/services/usdaFoodService";

// Automatically maps Hindi → English
const dal = await searchIndianFoods("dal"); // → searches "lentils"
const roti = await searchIndianFoods("roti"); // → searches "whole wheat flatbread"
const paneer = await searchIndianFoods("paneer"); // → searches "cottage cheese"
```

### Calculate Portions

```javascript
import { calculatePortionNutrition } from "@/services/usdaFoodService";

const food = { calories: 165, protein: 31, servingSize: 100 };

// Calculate for 150g
const nutrition = calculatePortionNutrition(food, 150, "g");
// → { calories: 248, protein: 46.5, ... }

// Calculate for different units
const nutrition = calculatePortionNutrition(food, 1, "cup"); // 240g
```

---

## 🌟 Advantages Over Nutritionix

| Feature           | USDA FoodData Central | Nutritionix         |
| ----------------- | --------------------- | ------------------- |
| **Cost**          | 100% FREE forever     | Paid (No free tier) |
| **Rate Limit**    | Unlimited             | Limited             |
| **Database Size** | 1,000,000+ foods      | 800,000+ foods      |
| **Data Quality**  | Official US Gov       | Third-party         |
| **Brand Foods**   | ✅ Yes                | ✅ Yes              |
| **Raw Foods**     | ✅ Yes                | ✅ Yes              |
| **Indian Foods**  | Good (via mapping)    | Better              |
| **API Stability** | Excellent             | Good                |

---

## 🔄 Hybrid Approach (Recommended)

**Best Strategy:**

1. **USDA API** for international/branded foods
2. **Custom Database** for common Indian foods (seeded)
3. **Admin Approval** for user-submitted foods

This gives you:

- ✅ Zero cost
- ✅ Fast response (cached Indian foods)
- ✅ Best coverage for Indian context
- ✅ Scalable for any cuisine

---

## 🎯 Usage in Phase 2 Implementation

When implementing meals management:

```javascript
// In app/api/foods/search/route.js
import { searchFoods, searchIndianFoods } from "@/services/usdaFoodService";
import Food from "@/model/food";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  // First, search custom database (Indian foods)
  const localFoods = await Food.find({
    name: { $regex: query, $options: "i" },
  }).limit(10);

  // Then, search USDA for branded/international foods
  const usdaFoods = await searchFoods(query, { pageSize: 15 });

  // Combine results
  return Response.json({
    foods: [...localFoods, ...usdaFoods],
  });
}
```

---

## 📖 Official Documentation

- **API Guide**: https://fdc.nal.usda.gov/api-guide.html
- **API Spec**: https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/
- **Data Types**: https://fdc.nal.usda.gov/data-documentation.html

---

## 🚀 Ready to Use!

Your NutriSync AI is now configured with:

- ✅ USDA service created
- ✅ Indian foods seed script ready
- ✅ Environment configured
- ✅ Implementation plan updated

**Next Steps:**

1. Get your free API key (30 seconds)
2. Update `.env` with your key
3. Run seed script: `node scripts/seedIndianFoods.js`
4. Start Phase 2 implementation! 🎉
