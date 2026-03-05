import { Button } from "@/components/ui/button"

export default function AiSuggestion() {

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">

      <h3 className="font-semibold text-yellow-700 mb-2">
        AI Suggestion
      </h3>

      <p className="text-sm text-gray-600">
        You are slightly behind on protein for the day.
        Consider adding grilled chicken breast or a
        protein shake to balance your macros.
      </p>

      <Button
        className="mt-4 bg-gray-600 hover:bg-black text-white"
      >
        View Recipe Ideas
      </Button>

    </div>
  )
}