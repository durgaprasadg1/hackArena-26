"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ImageIcon,
  Info,
  CheckCircle,
  XCircle,
  Dumbbell,
  Flame,
} from "lucide-react";

// ---------- Image Dialog ----------
function ExerciseImageDialog({ open, onClose, imageUrl, name }) {
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
            No image provided for this exercise.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- Exercise Details Dialog ----------
function ExerciseDetailsDialog({ open, onClose, exercise }) {
  if (!exercise) return null;

  const badges = {
    type: {
      cardio: "bg-orange-100 text-orange-700",
      strength: "bg-blue-100 text-blue-700",
      flexibility: "bg-purple-100 text-purple-700",
      balance: "bg-teal-100 text-teal-700",
      functional: "bg-indigo-100 text-indigo-700",
    },
    difficulty: {
      beginner: "bg-green-100 text-green-700",
      intermediate: "bg-yellow-100 text-yellow-700",
      advanced: "bg-red-100 text-red-700",
    },
  };

  const typeBadge = badges.type[exercise.type] || "bg-gray-100 text-gray-700";
  const diffBadge =
    badges.difficulty[exercise.difficulty] || "bg-gray-100 text-gray-700";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-emerald-700" />
            {exercise.name}
          </DialogTitle>
        </DialogHeader>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 -mt-1 mb-3">
          {exercise.type && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${typeBadge}`}
            >
              {exercise.type}
            </span>
          )}
          {exercise.difficulty && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${diffBadge}`}
            >
              {exercise.difficulty}
            </span>
          )}
        </div>

        {/* Calorie metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {exercise.caloriesPerMinute != null && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
              <Flame className="h-4 w-4 text-orange-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Calories / minute</p>
                <p className="font-bold text-gray-800 text-lg leading-tight">
                  {exercise.caloriesPerMinute}
                </p>
              </div>
            </div>
          )}
          {exercise.caloriesPerSet != null && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
              <Flame className="h-4 w-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Calories / set</p>
                <p className="font-bold text-gray-800 text-lg leading-tight">
                  {exercise.caloriesPerSet}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Muscle groups */}
        {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
              Muscle Groups
            </p>
            <div className="flex flex-wrap gap-1.5">
              {exercise.muscleGroups.map((m) => (
                <span
                  key={m}
                  className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-full capitalize"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {exercise.description && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Description
            </p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-md px-3 py-2.5 leading-relaxed">
              {exercise.description}
            </p>
          </div>
        )}

        {/* Submitted by */}
        {exercise.addedBy && (
          <p className="text-xs text-gray-400 border-t pt-2 mt-2">
            Submitted by: {exercise.addedBy.name} ({exercise.addedBy.email})
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- Standalone cell components to keep per-row dialog state ----------
function ExerciseImageCell({ exercise }) {
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
      <ExerciseImageDialog
        open={open}
        onClose={() => setOpen(false)}
        imageUrl={exercise.imageUrl}
        name={exercise.name}
      />
    </>
  );
}

function ExerciseDetailsCell({ exercise }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-1"
        onClick={() => setOpen(true)}
      >
        <Info className="h-3.5 w-3.5" />
        Details
      </Button>
      <ExerciseDetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        exercise={exercise}
      />
    </>
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

function ExerciseActionCell({ row, onAction }) {
  const [pending, setPending] = useState(null); // 'accept' | 'deny' | null

  const handleClick = async (approved) => {
    setPending(approved ? "accept" : "deny");
    await onAction(row.original._id, approved);
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
export function getExerciseRequestColumns(onAction) {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium text-gray-800">{row.original.name}</div>
      ),
    },
    
    {
      id: "calorieBurnouts",
      header: "Calorie Burnouts",
      cell: ({ row }) => {
        const ex = row.original;
        return (
          <div className="text-sm text-gray-700 space-y-0.5">
            {ex.caloriesPerMinute != null && (
              <div>
                <span className="text-gray-500 text-xs">/ min: </span>
                <span className="font-semibold">{ex.caloriesPerMinute}</span>
              </div>
            )}
            {ex.caloriesPerSet != null && (
              <div>
                <span className="text-gray-500 text-xs">/ set: </span>
                <span className="font-semibold">{ex.caloriesPerSet}</span>
              </div>
            )}
            {ex.caloriesPerMinute == null && ex.caloriesPerSet == null && (
              <span className="text-gray-400 text-xs">—</span>
            )}
          </div>
        );
      },
    },
    {
      id: "details",
      header: "Details",
      cell: ({ row }) => <ExerciseDetailsCell exercise={row.original} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ExerciseActionCell row={row} onAction={onAction} />,
    },
  ];
}
