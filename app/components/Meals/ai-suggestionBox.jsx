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
  Sparkles,
  Lightbulb,
  Loader2,
  ChefHat,
  AlertCircle,
} from "lucide-react";

// Renders the plain-text AI response with light visual structure
function AIResponseBody({ content }) {
  if (!content) return null;

  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 text-sm text-gray-700 leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        // Detect section header: e.g. "OVERVIEW:", "QUICK WINS (TODAY):"
        const isHeader = /^[A-Z][A-Z\s'&()]+:/.test(trimmed);

        if (isHeader) {
          const colonIdx = trimmed.indexOf(":");
          const header = trimmed.slice(0, colonIdx);
          const rest = trimmed.slice(colonIdx + 1).trim();
          return (
            <div key={i} className="pt-3 first:pt-0">
              <p className="font-semibold text-gray-900 text-[11px] uppercase tracking-wider mb-1">
                {header}
              </p>
              {rest && <p>{rest}</p>}
            </div>
          );
        }

        // Numeric list items
        if (/^\d+\./.test(trimmed)) {
          return (
            <p
              key={i}
              className="pl-3 border-l-2 border-green-200 text-gray-600"
            >
              {trimmed}
            </p>
          );
        }

        return <p key={i}>{trimmed}</p>;
      })}
    </div>
  );
}

export default function AiSuggestion() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOpen = async (type) => {
    setOpen(true);
    setActiveType(type);
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/meals/ai-analysis?type=${type}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message || "Failed to generate AI response. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const dialogTitle =
    activeType === "summary"
      ? "Meal Nutrition Summary"
      : "Meal Improvement Tips";

  const dialogIcon =
    activeType === "summary" ? (
      <Sparkles className="w-5 h-5 text-purple-500" />
    ) : (
      <Lightbulb className="w-5 h-5 text-amber-500" />
    );

  return (
    <>
      {/* ── Card ── */}
      <div className="bg-linear-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-600" />
          </div>
          <h3 className="font-semibold text-violet-800 text-sm">
            NutriSync AI
          </h3>
        </div>

        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Get a personalised breakdown of your meals or actionable tips to
          optimise your nutrition — powered by AI.
        </p>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => handleOpen("summary")}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs h-9 gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Meal Summary
          </Button>

          <Button
            onClick={() => handleOpen("tips")}
            variant="outline"
            className="w-full border-violet-300 text-violet-700 hover:bg-violet-50 text-xs h-9 gap-2"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Improvement Tips
          </Button>
        </div>
      </div>

      {/* ── Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              {dialogIcon}
              {dialogTitle}
              {result?.dateLabel && (
                <span className="text-xs font-normal text-gray-400 ml-1">
                  ({result.dateLabel})
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-1 mt-2 min-h-0">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
                    <ChefHat className="w-7 h-7 text-violet-500" />
                  </div>
                  <Loader2 className="w-5 h-5 text-violet-400 absolute -bottom-1 -right-1 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {activeType === "summary"
                      ? "Analysing your meals…"
                      : "Crafting your tips…"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    NutriSync AI is reviewing your nutrition data
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center py-10 gap-3 text-center">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <p className="text-sm text-red-600 font-medium">
                  Oops! Something went wrong.
                </p>
                <p className="text-xs text-gray-500 max-w-xs">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 text-xs"
                  onClick={() => handleOpen(activeType)}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Result */}
            {!loading && !error && result && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      activeType === "summary"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {activeType === "summary" ? "AI Summary" : "AI Tips"}
                  </span>
                  <span className="text-xs text-gray-400">by NutriSync AI</span>
                </div>

                <AIResponseBody content={result.content} />
              </div>
            )}
          </div>

          {/* Regenerate footer */}
          {!loading && result && (
            <div className="border-t pt-3 mt-2 flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-gray-400 hover:text-gray-600 gap-1.5"
                onClick={() => handleOpen(activeType)}
              >
                
                Regenerate
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
