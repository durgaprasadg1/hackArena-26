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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ExerciseLogDialog({ open, onClose, log, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(
    log?.durationMinutes || 0,
  );
  const [sets, setSets] = useState(log?.sets || 0);
  const [notes, setNotes] = useState(log?.notes || "");

  const exercise = log?.exerciseId || {};
  const isCardio = exercise.type === "cardio" || log?.exerciseType === "cardio";

  const estimatedCalories = isCardio
    ? Math.round((exercise.caloriesPerMinute || 0) * durationMinutes)
    : Math.round((exercise.caloriesPerSet || 0) * sets);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/exercises/log?id=${log._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationMinutes, sets, notes }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update");

      toast.success("Exercise log updated!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Exercise Log</DialogTitle>
          <p className="text-sm text-gray-500 capitalize">
            {log.exerciseName} · {log.exerciseType}
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {isCardio ? (
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(e) =>
                  setDurationMinutes(parseInt(e.target.value) || 0)
                }
              />
            </div>
          ) : (
            <div>
              <Label>Sets</Label>
              <Input
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          <div>
            <Label>Notes (optional)</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. felt strong today"
            />
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700 flex justify-between">
            <span>Estimated calories burned:</span>
            <span className="font-bold">{estimatedCalories} kcal</span>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
