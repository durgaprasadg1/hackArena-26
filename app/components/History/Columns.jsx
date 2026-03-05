"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, FileText } from "lucide-react";

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
        const intake = row.original.intake;
        const expected = row.original.expected;

        let color = "bg-emerald-100 text-emerald-700";
        if (intake > expected) color = "bg-red-100 text-red-700";
        else if (intake < expected) color = "bg-blue-100 text-blue-700";

        return (
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${color}`}
          >
            {intake} / {expected}
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
