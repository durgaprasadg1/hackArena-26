import MealSidebar from "../../components/Meals/meal-sidebar"
import MealLog from "../../components/Meals/meal-log"
import DailySummary from "../../components/Meals/daily-summary"
import MacrosCard from "../../components/Meals/macros-card"
import AiSuggestion from "../../components/Meals/ai-suggestionBox"

export default function MealLogPage() {

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      <h1 className="text-xl font-semibold mb-6">
        Today's Meals
      </h1>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr_320px]">

        {/* LEFT */}
        <MealSidebar />

        {/* CENTER */}
        <MealLog />

        {/* RIGHT */}
        <div className="space-y-6">
          <DailySummary />
          <MacrosCard />
          <AiSuggestion />
        </div>

      </div>

    </div>
  )
}