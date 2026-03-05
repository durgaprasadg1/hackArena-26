"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "../../components/History/Table";
import { getFoodRequestColumns } from "../../components/Admin/FoodRequestColumns";
import { toast } from "sonner";
import { Loader, Loader2, ShieldCheck, UtensilsCrossed } from "lucide-react";

export default function AdminFoodRequestsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/meals/admin/approve");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch requests");
      setData(json.pendingRequests || []);
    } catch (err) {
      toast.error("Failed to load food requests", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleAction = async (foodId, approved) => {
    try {
      const res = await fetch("/api/meals/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodId, approved }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Action failed");

      toast.success(
        approved ? "Food request approved!" : "Food request denied.",
        {
          description: approved
            ? "The food item is now verified and available."
            : "The food item has been removed.",
        }
      );
      // Remove handled item from local state immediately
      setData((prev) => prev.filter((f) => f._id !== foodId));
    } catch (err) {
      toast.error("Action failed", { description: err.message });
    }
  };

  const columns = getFoodRequestColumns(handleAction);

  return (
    <div className="min-h-screen bg-gray-50/60 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-emerald-700/10">
            <UtensilsCrossed className="h-6 w-6 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Food Requests
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Review and approve or deny user-submitted food items.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-emerald-700/10 text-emerald-700 text-sm font-medium px-3 py-1.5 rounded-full">
            <ShieldCheck className="h-4 w-4" />
            Admin Panel
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-24 text-gray-400">
           <Loader2 size={30} className="animate-spin"/>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
            <UtensilsCrossed className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No pending food requests</p>
            <p className="text-sm text-gray-400 mt-1">
              All submissions have been reviewed.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-4">
              {data.length} pending request{data.length !== 1 ? "s" : ""}
            </p>
            <DataTable columns={columns} data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
