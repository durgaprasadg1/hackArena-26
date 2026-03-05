"use client";

import { Button } from "@/components/ui/button";

export const columns = [
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

      let color = "bg-green-100 text-green-700";

      if (intake > expected) {
        color = "bg-red-100 text-red-700";
      } else if (intake < expected) {
        color = "bg-blue-100 text-blue-700";
      }

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
            className="bg-gray-600 hover:bg-black text-white"
          >
            Get Summary
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="bg-green-600 hover:bg-black text-white"
          >
            Generate Report
          </Button>
        </div>
      );
    },
  },
];