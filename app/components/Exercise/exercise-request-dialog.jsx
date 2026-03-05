"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TYPES = ["cardio", "strength", "flexibility", "balance", "functional"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const MUSCLE_OPTIONS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "core",
  "glutes",
  "quadriceps",
  "hamstrings",
  "calves",
  "full body",
];

export default function ExerciseRequestDialog({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "cardio",
    difficulty: "beginner",
    muscleGroups: [],
    caloriesPerMinute: "",
    caloriesPerSet: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMuscle = (muscle) => {
    setFormData((prev) => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(muscle)
        ? prev.muscleGroups.filter((m) => m !== muscle)
        : [...prev.muscleGroups, muscle],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Exercise name is required");
      return;
    }
    if (!formData.caloriesPerMinute && !formData.caloriesPerSet) {
      toast.error("Please provide at least calories per minute or per set");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/exercises/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          caloriesPerMinute: formData.caloriesPerMinute
            ? parseFloat(formData.caloriesPerMinute)
            : undefined,
          caloriesPerSet: formData.caloriesPerSet
            ? parseFloat(formData.caloriesPerSet)
            : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Submission failed");

      toast.success(
        "Exercise request submitted! You'll be notified when reviewed.",
      );
      onSuccess?.();
      onClose();
      setFormData({
        name: "",
        type: "cardio",
        difficulty: "beginner",
        muscleGroups: [],
        caloriesPerMinute: "",
        caloriesPerSet: "",
        description: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request New Exercise</DialogTitle>
          <p className="text-sm text-gray-500">
            Fill in the details below. An admin will review and verify it.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div>
            <Label>Exercise Name *</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Bulgarian Split Squat"
              required
            />
          </div>

          {/* Type + Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type *</Label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Difficulty *</Label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} className="capitalize">
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calorie info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Calories / Minute</Label>
              <Input
                name="caloriesPerMinute"
                type="number"
                min="0"
                step="0.1"
                value={formData.caloriesPerMinute}
                onChange={handleChange}
                placeholder="e.g. 8.5"
              />
              <p className="text-xs text-gray-400 mt-1">For cardio exercises</p>
            </div>
            <div>
              <Label>Calories / Set</Label>
              <Input
                name="caloriesPerSet"
                type="number"
                min="0"
                step="0.1"
                value={formData.caloriesPerSet}
                onChange={handleChange}
                placeholder="e.g. 15"
              />
              <p className="text-xs text-gray-400 mt-1">
                For strength exercises
              </p>
            </div>
          </div>

          {/* Muscle Groups */}
          <div>
            <Label>Muscle Groups</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {MUSCLE_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMuscle(m)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors capitalize ${
                    formData.muscleGroups.includes(m)
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the exercise, how to perform it..."
              rows={3}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
            📧 You will receive an email confirmation and will be notified once
            an admin reviews your request.
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
