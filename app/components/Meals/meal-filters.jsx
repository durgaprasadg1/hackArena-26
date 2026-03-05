import { Button } from "@/components/ui/button"

export default function MealFilters() {

  const filters = ["High Protein", "Vegan", "Low Carb"]

  return (
    <div className="flex flex-wrap gap-3 mb-6">

      <input
        placeholder="Search meals"
        className="border rounded-lg px-3 py-2 text-sm"
      />

      {filters.map((f) => (
        <button
          key={f}
          className="border px-3 py-2 rounded-full text-sm"
        >
          {f}
        </button>
      ))}

      <Button className="bg-green-600 hover:bg-green-700 text-white">
        + Add Custom
      </Button>

    </div>
  )
}