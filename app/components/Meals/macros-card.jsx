export default function MacrosCard() {

  const macros = [
    { name: "Protein", progress: "40%", color: "bg-blue-500" },
    { name: "Carbs", progress: "60%", color: "bg-yellow-500" },
    { name: "Fat", progress: "70%", color: "bg-red-500" },
  ]

  return (
    <div className="bg-white border rounded-xl p-6">

      <h3 className="font-semibold mb-4">
        Macronutrients
      </h3>

      <div className="space-y-4">

        {macros.map((m) => (

          <div key={m.name}>

            <div className="flex justify-between text-sm mb-1">
              <span>{m.name}</span>
            </div>

            <div className="h-2 bg-gray-100 rounded">

              <div
                className={`h-2 rounded ${m.color}`}
                style={{ width: m.progress }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}