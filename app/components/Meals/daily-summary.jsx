export default function DailySummary() {

  return (
    <div className="bg-white border rounded-xl p-6 text-center">

      <h3 className="font-semibold mb-4">
        Daily Summary
      </h3>

      <div className="text-3xl font-bold text-green-600">
        1,120
      </div>

      <p className="text-gray-500 text-sm">
        KCAL LOGGED
      </p>

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">
            Goal
          </p>
          <p className="font-semibold">
            2,200
          </p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">
            Remaining
          </p>
          <p className="font-semibold text-green-600">
            1,080
          </p>
        </div>

      </div>

    </div>
  )
}