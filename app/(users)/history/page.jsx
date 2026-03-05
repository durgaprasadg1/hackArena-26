"use client";

import { useEffect, useState } from "react";
import { DataTable } from "../../components/History/Table";
import { columns } from "../../components/History/Columns";
import { toast } from "sonner";

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/meals/history?days=30");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch history");
      }

      setData(result.history || []);
    } catch (error) {
      console.error("Fetch history error:", error);
      toast.error("Failed to load history", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Nutrition History</h1>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading your nutrition history...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-lg">
          <p className="text-gray-500 mb-2">No nutrition history yet</p>
          <p className="text-sm text-gray-400">
            Start logging your meals to see your history here
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
