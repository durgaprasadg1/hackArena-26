"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, LayoutDashboard, AlertCircle } from "lucide-react";

function AIResponseBody({ content }) {
  if (!content) return null;
  const lines = content.split("\n");
  return (
    <div className="space-y-1.5 text-sm text-gray-700 leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
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
        if (/^\d+\./.test(trimmed)) {
          return (
            <p
              key={i}
              className="pl-3 border-l-2 border-emerald-200 text-gray-600"
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

export default function AiSummaryDialog({
  open,
  onOpenChange,
  date,
  dateLabel,
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchSummary = async (targetDate) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`/api/history/ai-summary?date=${targetDate}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch whenever the dialog becomes open with a new date
  useEffect(() => {
    if (open && date) {
      fetchSummary(date);
    }
    // Reset state when closed
    if (!open) {
      setResult(null);
      setError(null);
    }
  }, [open, date]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Daily Health Summary
            {(result?.dateLabel || dateLabel) && (
              <span className="text-xs font-normal text-gray-400 ml-1">
                ({result?.dateLabel || dateLabel})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 mt-2 min-h-0">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <LayoutDashboard className="w-7 h-7 text-emerald-500" />
                </div>
                <Loader2 className="w-5 h-5 text-emerald-400 absolute -bottom-1 -right-1 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Analysing your day…
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  NutriSync AI is reviewing your meals and workouts
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
                onClick={() => fetchSummary(date)}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Result */}
          {!loading && !error && result && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                  AI Daily Summary
                </span>
                <span className="text-xs text-gray-400">by NutriSync AI</span>
              </div>
              <AIResponseBody content={result.content} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
