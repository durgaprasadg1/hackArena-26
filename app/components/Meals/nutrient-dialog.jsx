"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function NutrientDialog({ food, open, onClose }) {
  if (!food) return null;

  const { nutrition, minerals, vitamins, servingSize } = food;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{food.name}</DialogTitle>
          <DialogDescription>
            {food.locality && `Famous in: ${food.locality} • `}
            Serving Size: {servingSize?.value} {servingSize?.unit}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Main Nutrition */}
          <div>
            <h3 className="font-semibold text-lg mb-3">
              Nutritional Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {nutrition &&
                Object.entries(nutrition).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 capitalize">{key}</p>
                    <p className="text-lg font-semibold">
                      {value?.toFixed(1) || 0}
                      {key === "calories" ? " kcal" : "g"}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Minerals */}
          {minerals && Object.keys(minerals).length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Minerals</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(minerals).map(
                  ([key, value]) =>
                    value > 0 && (
                      <div key={key} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 capitalize">
                          {key}
                        </p>
                        <p className="text-lg font-semibold">
                          {value?.toFixed(1) || 0}mg
                        </p>
                      </div>
                    ),
                )}
              </div>
            </div>
          )}

          {/* Vitamins */}
          {vitamins && Object.keys(vitamins).length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Vitamins</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(vitamins).map(
                  ([key, value]) =>
                    value > 0 && (
                      <div key={key} className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 capitalize">
                          {key.replace("vitamin", "Vitamin ")}
                        </p>
                        <p className="text-lg font-semibold">
                          {value?.toFixed(1) || 0}mg
                        </p>
                      </div>
                    ),
                )}
              </div>
            </div>
          )}

          {food.imageUrl && (
            <div>
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
