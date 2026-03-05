"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "../../components/History/Table";
import { toast } from "sonner";
import { Loader2, CalendarDays } from "lucide-react";
import AiSummaryDialog from "../../components/History/AiSummaryDialog";

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Summary dialog state
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryRow, setSummaryRow] = useState(null);

  // PDF generation loading state
  const [generatingPdf, setGeneratingPdf] = useState(false);

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

  /** Convert dateObj (ISO string or Date) to YYYY-MM-DD for API calls */
  const toIsoDate = (dateObj) => {
    const d = new Date(dateObj);
    return d.toISOString().split("T")[0];
  };

  const handleGetSummary = useCallback((row) => {
    setSummaryRow(row);
    setSummaryOpen(true);
  }, []);

  const handleGenerateReport = useCallback(
    async (row) => {
      if (generatingPdf) return;
      setGeneratingPdf(true);
      const toastId = toast.loading("Generating PDF report…");
      try {
        const dateParam = toIsoDate(row.dateObj);
        const res = await fetch(`/api/history/report-data?date=${dateParam}`);
        const reportData = await res.json();

        if (!res.ok)
          throw new Error(reportData.error || "Failed to fetch data");

        // Dynamically import to keep PDF lib client-only (avoids SSR issues)
        const { generateDailyReport } =
          await import("../../components/History/generatePDF");
        await generateDailyReport(reportData);

        toast.success("Report downloaded!", { id: toastId });
      } catch (err) {
        console.error("PDF generation error:", err);
        toast.error("Failed to generate report", {
          id: toastId,
          description: err.message,
        });
      } finally {
        setGeneratingPdf(false);
      }
    },
    [generatingPdf],
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Nutrition History
          </h1>
          <p className="text-sm text-gray-500">
            Last 30 days — meals &amp; exercise overview
          </p>
        </div>
      </div>

      {/* Loading spinner */}
      {loading ? (
        
 
      <div className="min-h-screen font-sans text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
          <p className="mt-4 text-gray-600"></p>
        </div>
      </div>
    
 
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-white border border-emerald-100 rounded-lg">
          <CalendarDays className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-1">
            No nutrition history yet
          </p>
          <p className="text-sm text-gray-400">
            Start logging your meals to see your history here
          </p>
        </div>
      ) : (
        <DataTable
          data={data}
          onGetSummary={handleGetSummary}
          onGenerateReport={handleGenerateReport}
        />
      )}

      {/* AI Daily Summary Dialog */}
      {summaryRow && (
        <AiSummaryDialog
          open={summaryOpen}
          onOpenChange={setSummaryOpen}
          date={toIsoDate(summaryRow.dateObj)}
          dateLabel={summaryRow.date}
        />
      )}
    </div>
  );
}
