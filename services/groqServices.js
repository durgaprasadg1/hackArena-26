import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateHealthSummary(data) {
  const prompt = `
User Data

Calories Intake: ${data.intake}
Calories Burned: ${data.burn}
Sleep: ${data.sleep}
Water Intake: ${data.water}

Give improvement suggestions.
`;

  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

// ─── Meal AI Analysis Functions ───────────────────────────────────────────────

function buildMealContext(userData, mealData) {
  const {
    name,
    age,
    gender,
    weightKg,
    heightCm,
    activityLevel,
    goalType,
    targetWeight,
    dailyCalorieTarget,
    dietaryRestrictions,
    healthConditions,
  } = userData;

  const { meals, totals, dateLabel } = mealData;

  // Build a readable meal breakdown
  const mealLines = [];
  for (const [mealType, entries] of Object.entries(meals)) {
    if (entries && entries.length > 0) {
      mealLines.push(`\n${mealType.toUpperCase()}:`);
      entries.forEach((entry) => {
        const cal = Math.round(entry.nutritionConsumed?.calories || 0);
        const pro = Math.round(entry.nutritionConsumed?.protein || 0);
        const carb = Math.round(entry.nutritionConsumed?.carbs || 0);
        const fat = Math.round(entry.nutritionConsumed?.fat || 0);
        const qty = entry.quantity || 1;
        const unit = entry.servingSize?.unit || "serving";
        mealLines.push(
          `  - ${entry.foodName} (${qty} ${unit}): ${cal} kcal | ${pro}g protein | ${carb}g carbs | ${fat}g fat`,
        );
      });
    }
  }

  const mealBreakdown =
    mealLines.length > 0
      ? mealLines.join("\n")
      : "  No meals logged yet for this period.";

  const restrictions = dietaryRestrictions?.length
    ? dietaryRestrictions.join(", ")
    : "None";

  const conditions = healthConditions?.length
    ? healthConditions.join(", ")
    : "None";

  const goalMap = {
    lose_weight: "Lose Weight",
    gain_weight: "Gain Weight / Bulk",
    maintain: "Maintain Current Weight",
    build_muscle: "Build Muscle & Recomposition",
  };

  const activityMap = {
    sedentary: "Sedentary (little or no exercise)",
    light: "Lightly Active (1-3 days/week)",
    moderate: "Moderately Active (3-5 days/week)",
    active: "Very Active (6-7 days/week)",
  };

  return `
USER PROFILE:
  Name: ${name || "User"}
  Age: ${age ? age + " years" : "Not specified"}
  Gender: ${gender || "Not specified"}
  Weight: ${weightKg ? weightKg + " kg" : "Not specified"}
  Height: ${heightCm ? heightCm + " cm" : "Not specified"}
  Activity Level: ${activityMap[activityLevel] || activityLevel || "Not specified"}
  Primary Goal: ${goalMap[goalType] || goalType || "Not specified"}
  Target Weight: ${targetWeight ? targetWeight + " kg" : "Not specified"}
  Daily Calorie Target: ${dailyCalorieTarget ? dailyCalorieTarget + " kcal" : "Not specified"}
  Dietary Restrictions: ${restrictions}
  Health Conditions: ${conditions}

MEAL LOG (${dateLabel}):${mealBreakdown}

NUTRITIONAL TOTALS:
  Total Calories:  ${Math.round(totals.calories)} kcal  ${dailyCalorieTarget ? `(Goal: ${dailyCalorieTarget} kcal | ${Math.round((totals.calories / dailyCalorieTarget) * 100)}% achieved)` : ""}
  Protein:         ${Math.round(totals.protein)} g
  Carbohydrates:   ${Math.round(totals.carbs)} g
  Fat:             ${Math.round(totals.fat)} g
  Fiber:           ${Math.round(totals.fiber)} g
  Sugar:           ${Math.round(totals.sugar)} g
`;
}

export async function generateMealSummary(userData, mealData) {
  const context = buildMealContext(userData, mealData);

  const systemPrompt = `You are NutriSync AI — a world-class clinical nutritionist, registered dietitian, and metabolic health expert with 20+ years of combined experience in human nutrition science, macro optimization, and goal-directed dietary planning.

Your role is to generate a deeply insightful, personalized NUTRITIONAL MEAL SUMMARY for a user based on their specific meal log and health profile.

STRICT RESPONSE RULES:
1. Write in clean, readable plain text. Do NOT use markdown symbols like **, ##, *, or bullet dashes that look like code. Use natural section headers by writing them in CAPS followed by a colon.
2. Be SPECIFIC — reference the actual names of foods they ate, use their exact numbers, mention their exact goal.
3. Be PERSONALIZED — every sentence should feel written for THIS specific user, not generic.
4. Be HONEST but ENCOURAGING — acknowledge nutritional gaps tactfully, celebrate what they did well.
5. Structure your response with these 5 sections:
   - OVERVIEW: 2-3 sentences on their overall day — how they did against their calorie goal, general impression.
   - MACRONUTRIENT BREAKDOWN: Analyze protein, carbs, fat individually — what's on track, what's off, and why it matters for their goal.
   - MEAL DISTRIBUTION: Comment on how their eating is spread across meals — timing, portion balance, skipped meals.
   - NUTRITIONAL HIGHLIGHTS: 2-3 specific positive observations about their food choices (e.g., good fiber source, quality protein).
   - GOAL ALIGNMENT: A direct assessment of whether today's eating pattern supports their stated goal (${userData.goalType || "their goal"}) — be direct but kind.
6. End with ONE brief motivating sentence.
7. Keep total response under 380 words. Be concise and valuable.`;

  const userPrompt = `Please generate a comprehensive nutritional meal summary for the following user data:\n${context}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.65,
    max_tokens: 700,
  });

  return response.choices[0].message.content;
}

export async function generateMealImprovementTips(userData, mealData) {
  const context = buildMealContext(userData, mealData);

  const systemPrompt = `You are NutriSync AI — a world-class clinical nutritionist, certified sports dietitian, and behavioral nutrition coach. You specialize in translating nutrition science into practical, highly actionable meal optimization strategies that people can immediately apply.

Your role is to generate specific, science-backed MEAL IMPROVEMENT TIPS for a user based on their actual meal log, nutritional gaps, and personal health goal.

STRICT RESPONSE RULES:
1. Write in clean, readable plain text. Do NOT use markdown symbols like **, ##, *, or dashes that look like code formatting. Use CAPS for section titles.
2. Be SPECIFIC to what they actually ate — your tips must reference their real foods and real numbers, not generic advice.
3. Every tip must be ACTIONABLE — tell them exactly WHAT to do, HOW to do it, and WHY it helps their specific goal.
4. Structure your response with these 4 sections:
   - QUICK WINS (TODAY): 2-3 things they can do RIGHT NOW or for their next meal to immediately improve today's nutrition. Be specific (e.g., "Add 30g of paneer to your dinner to close the 20g protein gap").
   - MACRO FIXES: Identify the 1-2 biggest macro imbalances and give targeted food suggestions to correct them. Name real, accessible foods with approximate quantities.
   - MEAL TIMING & HABITS: 1-2 practical observations about when or how they are eating, with a clear corrective recommendation.
   - TOMORROW'S PLAN: 2-3 concrete suggestions for tomorrow — specific breakfast, snack, or meal swaps that align with their goal of ${userData.goalType || "better health"}.
5. Be HONEST — if they are overeating, say so clearly with a solution. If they are undereating, flag it.
6. Avoid generic wellness clichés. Every sentence should earn its place.
7. Keep total response under 400 words. Be dense with value, not fluff.`;

  const userPrompt = `Please generate targeted, actionable meal improvement tips for the following user data:\n${context}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 750,
  });

  return response.choices[0].message.content;
}
