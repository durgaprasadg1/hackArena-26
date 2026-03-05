"use client";

import { useState, useEffect } from "react";
import { Eye, Plus, Trash2, Search, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NutrientDialog from "./nutrient-dialog";
import FoodRequestDialog from "./food-request-dialog";

export default function MealLog({ selectedMeal, onMealUpdate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mealEntries, setMealEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [nutrientDialogOpen, setNutrientDialogOpen] = useState(false);
  const [foodRequestOpen, setFoodRequestOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  // Fetch today's meal entries
  useEffect(() => {
    fetchMealEntries();
  }, [selectedMeal]);

  // Search foods as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchFoods();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchMealEntries = async () => {
    try {
      const response = await fetch("/api/meals/log");
      const data = await response.json();

      if (data.success) {
        setMealEntries(data.meals[selectedMeal] || []);
        onMealUpdate && onMealUpdate(data);
      }
    } catch (error) {
      console.error("Fetch meal entries error:", error);
    }
  };

  const searchFoods = async () => {
    setSearching(true);
    try {
      const response = await fetch(
        `/api/meals/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.foods);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search foods");
    } finally {
      setSearching(false);
    }
  };

  const handleAddFood = async (food) => {
    setLoading(true);
    try {
      const response = await fetch("/api/meals/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodId: food._id,
          mealType: selectedMeal,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add food");
      }

      toast.success(`${food.name} added to ${selectedMeal}`);
      fetchMealEntries();
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Add food error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFood = async (logId) => {
    try {
      const response = await fetch(`/api/meals/log?id=${logId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove food");
      }

      toast.success("Food removed from meal log");
      fetchMealEntries();
    } catch (error) {
      console.error("Remove food error:", error);
      toast.error(error.message);
    }
  };

  const handleViewNutrients = (food) => {
    setSelectedFood(food);
    setNutrientDialogOpen(true);
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      {/* Search Section */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setFoodRequestOpen(true)}
            className="whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Request Food
          </Button>
        </div>

        {/* Search Results */}
        {searching && (
          <div className="text-center py-4 text-gray-500">Searching...</div>
        )}

        {searchResults.length > 0 && (
          <div className="max-h-64 overflow-y-auto border rounded-lg">
            {searchResults.map((food) => (
              <div
                key={food._id}
                className="flex items-center justify-between p-3 border-b last:border-none hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium">{food.name}</p>
                  <p className="text-sm text-gray-500">
                    {food.locality && `${food.locality} • `}
                    {food.nutrition?.calories || 0} kcal per{" "}
                    {food.servingSize?.value}
                    {food.servingSize?.unit}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewNutrients(food)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddFood(food)}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchQuery.length >= 2 &&
          searchResults.length === 0 &&
          !searching && (
            <div className="text-center py-4 text-gray-500">
              No foods found. Try requesting a new food item.
            </div>
          )}
      </div>

      {/* Current Meal Entries */}
      <h2 className="font-semibold mb-4 capitalize">{selectedMeal} Log</h2>

      {mealEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No items added yet. Search and add foods above.
        </div>
      ) : (
        <div className="space-y-3">
          {mealEntries.map((entry) => (
            <div
              key={entry._id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 flex-1">
                {entry.foodId?.imageUrl && (
                  <img
                    src={entry.foodId.imageUrl}
                    alt={entry.foodName}
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{entry.foodName}</p>
                  <p className="text-sm text-gray-500">
                    {entry.nutritionConsumed?.calories?.toFixed(0) || 0} kcal •{" "}
                    {entry.nutritionConsumed?.protein?.toFixed(1) || 0}g protein
                    • {entry.nutritionConsumed?.carbs?.toFixed(1) || 0}g carbs •{" "}
                    {entry.nutritionConsumed?.fat?.toFixed(1) || 0}g fat
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewNutrients(entry.foodId)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveFood(entry._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <NutrientDialog
        food={selectedFood}
        open={nutrientDialogOpen}
        onClose={() => setNutrientDialogOpen(false)}
      />

      <FoodRequestDialog
        open={foodRequestOpen}
        onClose={() => setFoodRequestOpen(false)}
        onSuccess={() => {
          toast.success("Food request submitted successfully!");
        }}
      />
    </div>
  );
}
