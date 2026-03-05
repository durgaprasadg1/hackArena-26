"use client";

import { Button } from "@/components/ui/button";
import {
  Sparkles,
  FileText,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export function createColumns({ onGetSummary, onGenerateReport }) {
  return [
    {
      accessorKey: "day",
      header: "Day",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "calories",
      header: "Calories (Intake / Expected)",
      cell: ({ row }) => {
        const { intake, expected, diff, adjustmentPerDay, balanced } =
          row.original;

        // Badge colour
        let badgeColor = "bg-emerald-100 text-emerald-700";
        if (intake > expected) badgeColor = "bg-amber-100 text-amber-700";
        else if (intake < expected) badgeColor = "bg-blue-100 text-blue-700";

        // Balance sub-line
        let balanceLine = null;
        if (balanced) {
          balanceLine = (
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-3 h-3" />
              On track
            </span>
          );
        } else if (diff > 0 && adjustmentPerDay !== null) {
          balanceLine = (
            <span className="flex items-center gap-1 text-amber-600">
              <TrendingDown className="w-3 h-3" />+{diff} kcal → &minus;
              {Math.abs(adjustmentPerDay)} kcal/day × 3
            </span>
          );
        } else if (diff < 0 && adjustmentPerDay !== null) {
          balanceLine = (
            <span className="flex items-center gap-1 text-blue-600">
              <TrendingUp className="w-3 h-3" />
              {diff} kcal → +{Math.abs(adjustmentPerDay)} kcal/day × 3
            </span>
          );
        } else if (diff > 0) {
          balanceLine = (
            <span className="flex items-center gap-1 text-amber-500">
              <TrendingDown className="w-3 h-3" />+{diff} kcal over
            </span>
          );
        } else if (diff < 0) {
          balanceLine = (
            <span className="flex items-center gap-1 text-blue-500">
              <TrendingUp className="w-3 h-3" />
              {diff} kcal under
            </span>
          );
        }

        return (
          <div className="flex flex-col gap-1">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${badgeColor}`}
            >
              {intake} / {expected} kcal
            </div>
            {balanceLine && (
              <span className="text-xs font-medium pl-1">{balanceLine}</span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              onClick={() => onGetSummary(row.original)}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get Summary
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-1.5"
              onClick={() => onGenerateReport(row.original)}
            >
              <FileText className="w-3.5 h-3.5" />
              Generate Report
            </Button>
          </div>
        );
      },
    },
  ];
}
