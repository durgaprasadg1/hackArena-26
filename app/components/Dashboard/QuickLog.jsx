"use client";
import React, { useState, useEffect } from "react";
import { Plus, Minus, Edit2, Droplets, Moon, Check, X } from "lucide-react";

const QuickLog = () => {
  const [water, setWater] = useState({ amount: 0, target: 2.5 });
  const [sleep, setSleep] = useState({ hours: 0, logged: false });
  const [loading, setLoading] = useState(false);
  const [editingSleep, setEditingSleep] = useState(false);
  const [sleepInput, setSleepInput] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    fetchWaterLog();
    fetchSleepLog();
  }, []);

  const fetchWaterLog = async () => {
    try {
      const res = await fetch("/api/water");
      if (!res.ok) {
        console.log("Water API error:", res.status);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setWater({ amount: data.amount, target: data.target });
      }
    } catch (error) {
      console.log("Error fetching water log:", error);
      return;
    }
  };

  const fetchSleepLog = async () => {
    try {
      const res = await fetch("/api/sleep");
      if (!res.ok) {
        console.log("Sleep API error:", res.status);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setSleep(data);
        if (data.logged) {
          const hours = Math.floor(data.hours);
          const minutes = Math.round((data.hours - hours) * 60);
          setSleepInput({ hours, minutes });
        }
      }
    } catch (error) {
      console.log("Error fetching sleep log:", error);
    }
  };

  const addWater = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 0.25 }), // 250ml = 1 glass
      });
      if (!res.ok) {
        console.log("Water API error:", res.status);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setWater({ amount: data.amount, target: data.target });
      }
    } catch (error) {
      console.log("Error adding water:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeWater = async () => {
    if (water.amount <= 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/water", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 0.25 }),
      });
      if (!res.ok) {
        console.log("Water API error:", res.status);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setWater({ amount: data.amount, target: data.target });
      }
    } catch (error) {
      console.log("Error removing water:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSleep = async () => {
    setLoading(true);
    try {
      const totalHours = sleepInput.hours + sleepInput.minutes / 60;
      const res = await fetch("/api/sleep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours: totalHours }),
      });
      if (!res.ok) {
        console.log("Sleep API error:", res.status);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setSleep(data);
        setEditingSleep(false);
      }
    } catch (error) {
      console.log("Error saving sleep:", error);
    } finally {
      setLoading(false);
    }
  };

  const glasses = Math.round(water.amount / 0.25);
  const targetGlasses = Math.round(water.target / 0.25);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Daily Quick Log
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water Intake */}
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Water Intake
              </h3>
              <p className="text-xs text-gray-500">
                {glasses} / {targetGlasses} Glasses
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={removeWater}
              disabled={loading || glasses === 0}
              className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={addWater}
              disabled={loading}
              className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sleep */}
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
          {editingSleep ? (
            <div className="flex-1 flex items-center gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={sleepInput.hours}
                  onChange={(e) =>
                    setSleepInput({
                      ...sleepInput,
                      hours: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-14 px-2 py-1 border rounded text-sm"
                  placeholder="Hrs"
                />
                <span className="text-xs text-gray-500">h</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={sleepInput.minutes}
                  onChange={(e) =>
                    setSleepInput({
                      ...sleepInput,
                      minutes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-14 px-2 py-1 border rounded text-sm"
                  placeholder="Min"
                />
                <span className="text-xs text-gray-500">m</span>
              </div>
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={saveSleep}
                  disabled={loading}
                  className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingSleep(false)}
                  className="w-7 h-7 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Moon className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Sleep</h3>
                  <p className="text-xs text-gray-500">
                    {sleep.logged
                      ? `${Math.floor(sleep.hours)}h ${Math.round((sleep.hours % 1) * 60)}m logged`
                      : "Not logged"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingSleep(true)}
                className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickLog;
