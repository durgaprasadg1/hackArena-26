"use client";

import { useState, useEffect } from "react";
import {
  Scale,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

export default function CalorieBalanceCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/calorie-balance")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-10 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-48 bg-gray-100 rounded" />
      </div>
    );
  }

  if (!data) return null;

  const { baseTarget, adjustedTarget, totalAdjustmentPerDay, adjustments } =
    data;
  const isAdjusted = Math.abs(totalAdjustmentPerDay) >= 10;
  const isReduced = totalAdjustmentPerDay > 0; // overate → reduced target
  const isIncreased = totalAdjustmentPerDay < 0; // underate → increased target

  const delta = Math.abs(Math.round(baseTarget - adjustedTarget));

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <div
      className={`rounded-2xl p-6 border shadow-sm ${
        !isAdjusted
          ? "bg-emerald-50 border-emerald-200"
          : isReduced
            ? "bg-amber-50 border-amber-200"
            : "bg-blue-50 border-blue-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Scale
          className={`w-5 h-5 ${
            !isAdjusted
              ? "text-emerald-600"
              : isReduced
                ? "text-amber-600"
                : "text-blue-600"
          }`}
        />
        <h2 className="text-base font-bold text-gray-900">Calorie Balance</h2>
      </div>

      {/* Adjusted target */}
      <div className="mb-3">
        <span
          className={`text-3xl font-extrabold ${
            !isAdjusted
              ? "text-emerald-700"
              : isReduced
                ? "text-amber-700"
                : "text-blue-700"
          }`}
        >
          {adjustedTarget.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500 ml-1">kcal target today</span>
      </div>

      {/* Status message */}
      {!isAdjusted ? (
        <div className="flex items-center gap-1.5 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>You&apos;re on track — no balance adjustments active.</span>
        </div>
      ) : (
        <>
          <div
            className={`flex items-start gap-1.5 text-sm mb-4 ${
              isReduced ? "text-amber-700" : "text-blue-700"
            }`}
          >
            {isReduced ? (
              <TrendingDown className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>
              {isReduced
                ? `You overate recently. Target reduced by ${delta} kcal today to rebalance.`
                : `You underate recently. Target increased by ${delta} kcal today to recover.`}
            </span>
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Active adjustments
            </p>
            {adjustments.map((a, i) => {
              const over = a.extraCalories > 0;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs rounded-lg px-3 py-2 bg-white/70"
                >
                  <span className="flex items-center gap-1 text-gray-600">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {formatDate(a.referenceDate)}
                  </span>
                  <span
                    className={`font-semibold ${over ? "text-amber-600" : "text-blue-600"}`}
                  >
                    {over ? "+" : ""}
                    {a.extraCalories} kcal &nbsp;→&nbsp;
                    {over ? "-" : "+"}
                    {Math.abs(a.adjustmentPerDay)} kcal/day
                  </span>
                </div>
              );
            })}
          </div>

          {/* Base target footnote */}
          <p className="text-xs text-gray-400 mt-3">
            Base target: {baseTarget.toLocaleString()} kcal/day
          </p>
        </>
      )}
    </div>
  );
}
