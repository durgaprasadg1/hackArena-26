"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Pencil,
  PlusCircle,
  Loader2,
  Dumbbell,
  Timer,
  Flame,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ExerciseRequestDialog from "./exercise-request-dialog";
import ExerciseLogDialog from "./exercise-log-dialog";

const TYPE_BADGE = {
  cardio: "bg-red-100 text-red-600",
  strength: "bg-blue-100 text-blue-600",
  flexibility: "bg-green-100 text-green-600",
  balance: "bg-purple-100 text-purple-600",
  functional: "bg-yellow-100 text-yellow-600",
};

const DIFFICULTY_COLOR = {
  beginner: "text-green-600",
  intermediate: "text-yellow-600",
  advanced: "text-red-600",
};

const FILTER_TYPES = [
  "all",
  "cardio",
  "strength",
  "flexibility",
  "balance",
  "functional",
];
const FILTER_DIFFICULTIES = ["all", "beginner", "intermediate", "advanced"];

export default function ExerciseLog({ onLogUpdate, filterType = "all", filterDifficulty = "all" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [logs, setLogs] = useState([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [editLog, setEditLog] = useState(null);

  // Pending add: when user clicks an exercise we ask for duration/sets
  const [pendingExercise, setPendingExercise] = useState(null);
  const [pendingDuration, setPendingDuration] = useState(30);
  const [pendingSets, setPendingSets] = useState(3);

  useEffect(() => {
    fetchLogs();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchExercises();
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterType, filterDifficulty]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/exercises/log");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
        onLogUpdate?.(data);
      }
    } catch (err) {
      console.error("Fetch logs error:", err);
    }
  };

  const searchExercises = async () => {
    setSearching(true);
    try {
      const params = new URLSearchParams({ q: searchQuery });
      if (filterType !== "all") params.append("type", filterType);
      if (filterDifficulty !== "all")
        params.append("difficulty", filterDifficulty);

      const res = await fetch(`/api/exercises/search?${params}`);
      const data = await res.json();
      if (data.success) setSearchResults(data.exercises);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectExercise = (exercise) => {
    setPendingExercise(exercise);
    setPendingDuration(30);
    setPendingSets(3);
  };

  const handleAddLog = async () => {
    if (!pendingExercise) return;
    setAdding(true);
    try {
      const isCardio = pendingExercise.type === "cardio";
      const res = await fetch("/api/exercises/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: pendingExercise._id,
          durationMinutes: isCardio ? pendingDuration : 0,
          sets: !isCardio ? pendingSets : 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add");

      toast.success(`${pendingExercise.name} logged!`);
      setPendingExercise(null);
      setSearchQuery("");
      setSearchResults([]);
      fetchLogs();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (logId) => {
    try {
      const res = await fetch(`/api/exercises/log?id=${logId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Exercise removed");
      fetchLogs();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isCardio = pendingExercise?.type === "cardio";
  const previewCalories = pendingExercise
    ? isCardio
      ? Math.round((pendingExercise.caloriesPerMinute || 0) * pendingDuration)
      : Math.round((pendingExercise.caloriesPerSet || 0) * pendingSets)
    : 0;

  return (
    <div className="bg-white border rounded-xl p-6 flex flex-col gap-5">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">Log Exercise</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setRequestOpen(true)}
          className="text-emerald-600 border-emerald-300 hover:bg-emerald-50 text-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 mr-1" /> Request New
        </Button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Search Results */}
      {(searchQuery.length >= 2 || searchResults.length > 0) && (
        <div className="border rounded-lg overflow-hidden">
          {searching && (
            <div className="flex items-center gap-2 px-4 py-3 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Searching...
            </div>
          )}

          {!searching &&
            searchResults.length === 0 &&
            searchQuery.length >= 2 && (
              <div className="px-4 py-4 text-center text-gray-500 text-sm">
                No exercises found.{" "}
                <button
                  className="text-emerald-600 underline"
                  onClick={() => setRequestOpen(true)}
                >
                  Request a new exercise
                </button>
              </div>
            )}

          {searchResults.map((ex) => (
            <div
              key={ex._id}
              className={`flex items-center justify-between px-4 py-3 border-b last:border-none hover:bg-gray-50 transition-colors cursor-pointer ${
                pendingExercise?._id === ex._id ? "bg-emerald-50" : ""
              }`}
              onClick={() => handleSelectExercise(ex)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{ex.name}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${TYPE_BADGE[ex.type] || "bg-gray-100 text-gray-600"}`}
                  >
                    {ex.type}
                  </span>
                  <span
                    className={`text-xs capitalize font-medium ${DIFFICULTY_COLOR[ex.difficulty] || ""}`}
                  >
                    {ex.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {ex.type === "cardio"
                    ? `${ex.caloriesPerMinute || 0} kcal/min`
                    : `${ex.caloriesPerSet || 0} kcal/set`}
                  {ex.muscleGroups?.length > 0 &&
                    ` · ${ex.muscleGroups.slice(0, 2).join(", ")}`}
                </p>
              </div>
              <Plus className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Pending add panel */}
      {pendingExercise && (
        <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">{pendingExercise.name}</p>
            <button
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              onClick={() => setPendingExercise(null)}
            >
              ×
            </button>
          </div>

          {isCardio ? (
            <div>
              <label className="text-xs text-gray-600 font-medium flex items-center gap-1">
                <Timer className="w-3 h-3" /> Duration (minutes)
              </label>
              <Input
                type="number"
                min="1"
                value={pendingDuration}
                onChange={(e) =>
                  setPendingDuration(parseInt(e.target.value) || 0)
                }
                className="mt-1"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs text-gray-600 font-medium flex items-center gap-1">
                <Dumbbell className="w-3 h-3" /> Sets
              </label>
              <Input
                type="number"
                min="1"
                value={pendingSets}
                onChange={(e) => setPendingSets(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-700 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Est. burn:
              <strong className="ml-1">{previewCalories} kcal</strong>
            </span>
            <Button
              size="sm"
              onClick={handleAddLog}
              disabled={adding}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Add to Log"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Today's Log */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Today's Workout Log</h3>

        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No exercises logged yet. Search above to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{log.exerciseName}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full capitalize ${TYPE_BADGE[log.exerciseType] || "bg-gray-100 text-gray-600"}`}
                    >
                      {log.exerciseType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {log.exerciseType === "cardio"
                      ? `${log.durationMinutes} min`
                      : `${log.sets} sets`}
                    {" · "}
                    <span className="text-emerald-600 font-medium">
                      {log.caloriesBurned} kcal burned
                    </span>
                    {log.notes && ` · ${log.notes}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditLog(log)}
                  >
                    <Pencil className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(log._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ExerciseRequestDialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
      />
      {editLog && (
        <ExerciseLogDialog
          open={!!editLog}
          onClose={() => setEditLog(null)}
          log={editLog}
          onSuccess={fetchLogs}
        />
      )}
    </div>
  );
}
