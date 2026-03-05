"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageIcon, FlaskConical, CheckCircle, XCircle } from "lucide-react";

// ---------- Image Dialog ----------
function ImageDialog({ open, onClose, imageUrl, name }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-800">{name} — Image</DialogTitle>
        </DialogHeader>
        {imageUrl ? (
          <div className="flex justify-center items-center min-h-65 bg-gray-50 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={name}
              className="max-h-72 max-w-full object-contain rounded-md"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
            No image provided for this food item.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- Nutrients Dialog ----------
function NutrientsDialog({ open, onClose, food }) {
  if (!food) return null;

  const { nutrition = {}, minerals = {}, vitamins = {}, servingSize = {} } = food;

  const nutrientRows = [
    { label: "Calories", value: nutrition.calories, unit: "kcal" },
    { label: "Protein", value: nutrition.protein, unit: "g" },
    { label: "Carbohydrates", value: nutrition.carbs, unit: "g" },
    { label: "Fat", value: nutrition.fat, unit: "g" },
    { label: "Fiber", value: nutrition.fiber, unit: "g" },
    { label: "Sugar", value: nutrition.sugar, unit: "g" },
  ];

  const mineralRows = [
    { label: "Sodium", value: minerals.sodium, unit: "mg" },
    { label: "Potassium", value: minerals.potassium, unit: "mg" },
    { label: "Calcium", value: minerals.calcium, unit: "mg" },
    { label: "Iron", value: minerals.iron, unit: "mg" },
    { label: "Phosphorus", value: minerals.phosphorus, unit: "mg" },
  ];

  const vitaminRows = [
    { label: "Vitamin A", value: vitamins.vitaminA, unit: "mcg" },
    { label: "Vitamin B", value: vitamins.vitaminB, unit: "mg" },
    { label: "Vitamin C", value: vitamins.vitaminC, unit: "mg" },
    { label: "Vitamin D", value: vitamins.vitaminD, unit: "mcg" },
    { label: "Vitamin E", value: vitamins.vitaminE, unit: "mg" },
    { label: "Vitamin K", value: vitamins.vitaminK, unit: "mcg" },
  ];

  const NutrientSection = ({ title, rows, accentClass }) => (
    <div className="mb-4">
      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${accentClass}`}>
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {rows.map(({ label, value, unit }) =>
          value != null ? (
            <div
              key={label}
              className="flex justify-between items-center bg-gray-50 rounded-md px-3 py-1.5 text-sm"
            >
              <span className="text-gray-600">{label}</span>
              <span className="font-semibold text-gray-800">
                {value} {unit}
              </span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800">
            {food.name} — Nutritional Info
          </DialogTitle>
          {servingSize?.value && (
            <p className="text-xs text-gray-500 mt-0.5">
              Per {servingSize.value} {servingSize.unit}
            </p>
          )}
        </DialogHeader>

        {food.locality && (
          <p className="text-sm text-gray-500 -mt-2 mb-2">
            Locality: <span className="font-medium text-gray-700">{food.locality}</span>
          </p>
        )}

        <NutrientSection
          title="Macronutrients"
          rows={nutrientRows}
          accentClass="text-emerald-700"
        />
        <NutrientSection
          title="Minerals"
          rows={mineralRows}
          accentClass="text-blue-600"
        />
        <NutrientSection
          title="Vitamins"
          rows={vitaminRows}
          accentClass="text-amber-600"
        />

        {food.createdBy && (
          <p className="text-xs text-gray-400 border-t pt-2 mt-2">
            Submitted by: {food.createdBy.name} ({food.createdBy.email})
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- Spinner ----------
function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

// ---------- Action Cell Component (Accept / Deny only) ----------
function ActionCell({ row, onAction }) {
  const food = row.original;
  const [pending, setPending] = useState(null); // 'accept' | 'deny' | null

  const handleClick = async (approved) => {
    setPending(approved ? "accept" : "deny");
    await onAction(food._id, approved);
    setPending(null);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={!!pending}
        className="bg-emerald-700 hover:bg-emerald-800 text-white gap-1 disabled:opacity-70"
        onClick={() => handleClick(true)}
      >
        {pending === "accept" ? <Spinner /> : <CheckCircle className="h-3.5 w-3.5" />}
        Accept
      </Button>
      <Button
        size="sm"
        disabled={!!pending}
        className="bg-red-600 hover:bg-red-700 text-white gap-1 disabled:opacity-70"
        onClick={() => handleClick(false)}
      >
        {pending === "deny" ? <Spinner /> : <XCircle className="h-3.5 w-3.5" />}
        Deny
      </Button>
    </div>
  );
}

// ---------- Column Definitions ----------
export function getFoodRequestColumns(onAction) {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium text-gray-800">{row.original.name}</div>
      ),
    },
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => <ImageButtonCell food={row.original} />,
    },
    {
      id: "nutrients",
      header: "Nutrients",
      cell: ({ row }) => <NutrientsButtonCell food={row.original} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionCell row={row} onAction={onAction} />,
    },
  ];
}

// Standalone dialog cells to keep state local per row
function ImageButtonCell({ food }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-100 gap-1"
        onClick={() => setOpen(true)}
      >
        <ImageIcon className="h-3.5 w-3.5" />
        View Image
      </Button>
      <ImageDialog
        open={open}
        onClose={() => setOpen(false)}
        imageUrl={food.imageUrl}
        name={food.name}
      />
    </>
  );
}

function NutrientsButtonCell({ food }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-1"
        onClick={() => setOpen(true)}
      >
        <FlaskConical className="h-3.5 w-3.5" />
        Nutrients
      </Button>
      <NutrientsDialog
        open={open}
        onClose={() => setOpen(false)}
        food={food}
      />
    </>
  );
}
