"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Moon,
  Droplets,
  Target,
  Heart,
  Flame,
  Edit2,
  Check,
  X,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";

const formatLabel = (str) => {
  if (!str) return "—";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
  iconColor = "text-[#10B981]",
}) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
    <div className={`mt-0.5 ${iconColor}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-gray-800 font-medium mt-0.5 truncate">
        {value || "—"}
      </p>
    </div>
  </div>
);

export default function ProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    heightCm: "",
    weightKg: "",
    sleepHours: "",
    waterIntakeLiters: "",
  });

  useEffect(() => {
    if (isLoaded) fetchProfile();
  }, [isLoaded]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        setEditForm({
          heightCm: data.user.profile?.heightCm ?? "",
          weightKg: data.user.profile?.weightKg ?? "",
          sleepHours: data.user.lifestyle?.sleepHours ?? "",
          waterIntakeLiters: data.user.lifestyle?.waterIntakeLiters ?? "",
        });
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            heightCm: editForm.heightCm ? Number(editForm.heightCm) : undefined,
            weightKg: editForm.weightKg ? Number(editForm.weightKg) : undefined,
          },
          lifestyle: {
            sleepHours: editForm.sleepHours
              ? Number(editForm.sleepHours)
              : undefined,
            waterIntakeLiters: editForm.waterIntakeLiters
              ? Number(editForm.waterIntakeLiters)
              : undefined,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated!");
        setEditing(false);
        fetchProfile();
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      heightCm: profile?.profile?.heightCm ?? "",
      weightKg: profile?.profile?.weightKg ?? "",
      sleepHours: profile?.lifestyle?.sleepHours ?? "",
      waterIntakeLiters: profile?.lifestyle?.waterIntakeLiters ?? "",
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto" />
          <p className="mt-4 text-gray-500 text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  const age = calculateAge(profile?.profile?.dob);
  const bmi = profile?.healthMetrics?.bmi;
  const bmr = profile?.healthMetrics?.bmr;

  const getBmiCategory = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { label: "Normal", color: "text-green-600" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-600" };
    return { label: "Obese", color: "text-red-500" };
  };

  const bmiInfo = getBmiCategory(bmi);

  const profilePic = profile?.profilePicture || clerkUser?.imageUrl;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={profile?.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-[#10B981]/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#10B981]/10 flex items-center justify-center ring-4 ring-[#10B981]/20">
                  <User className="w-12 h-12 text-[#10B981]" />
                </div>
              )}
              {profile?.role === "admin" && (
                <span className="absolute -bottom-1 -right-1 bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>

            {/* Name & Meta */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.name || clerkUser?.fullName || "User"}
                </h1>
                {profile?.onboarded && (
                  <BadgeCheck
                    className="w-5 h-5 text-[#10B981]"
                    title="Onboarded"
                  />
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
              <p className="text-gray-400 text-xs mt-1">
                Member since {formatDate(profile?.createdAt)}
              </p>
              {profile?.roleType && (
                <span className="inline-block mt-2 bg-[#10B981]/10 text-[#10B981] text-xs font-medium px-3 py-1 rounded-full">
                  {formatLabel(profile.roleType)}
                </span>
              )}
            </div>

            {/* Streak */}
            {profile?.streak?.current > 0 && (
              <div className="flex flex-col items-center bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                <span className="text-2xl font-bold text-orange-500">
                  🔥 {profile.streak.current}
                </span>
                <span className="text-xs text-orange-400 font-medium mt-0.5">
                  day streak
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Personal Info
            </h2>
            <InfoRow
              icon={User}
              label="Gender"
              value={formatLabel(profile?.profile?.gender)}
            />
            <InfoRow
              icon={Calendar}
              label="Date of Birth"
              value={
                profile?.profile?.dob
                  ? `${formatDate(profile.profile.dob)}${age ? ` (${age} yrs)` : ""}`
                  : null
              }
            />
            <InfoRow
              icon={Activity}
              label="Activity Level"
              value={formatLabel(profile?.profile?.activityLevel)}
            />
            <InfoRow
              icon={BadgeCheck}
              label="Work Category"
              value={formatLabel(profile?.profile?.workCategory)}
            />
            <InfoRow icon={Mail} label="Email" value={profile?.email} />
          </div>

          {/* Health Metrics */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Health Metrics
            </h2>
            <InfoRow
              icon={Ruler}
              label="Height"
              value={
                profile?.profile?.heightCm
                  ? `${profile.profile.heightCm} cm`
                  : null
              }
            />
            <InfoRow
              icon={Weight}
              label="Weight"
              value={
                profile?.profile?.weightKg
                  ? `${profile.profile.weightKg} kg`
                  : null
              }
            />
            <div className="flex items-start gap-3 py-2.5 border-b border-gray-100">
              <div className="mt-0.5 text-[#10B981]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  BMI
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {bmi ? (
                    <span>
                      {bmi.toFixed(1)}{" "}
                      {bmiInfo && (
                        <span
                          className={`${bmiInfo.color} text-xs font-semibold ml-1`}
                        >
                          ({bmiInfo.label})
                        </span>
                      )}
                    </span>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>
            <InfoRow
              icon={Flame}
              label="BMR (Base Metabolic Rate)"
              value={bmr ? `${Math.round(bmr)} kcal/day` : null}
            />
            {profile?.healthConditions?.length > 0 && (
              <div className="flex items-start gap-3 py-2.5">
                <div className="mt-0.5 text-[#10B981]">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    Health Conditions
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {profile.healthConditions.map((c) => (
                      <span
                        key={c}
                        className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium"
                      >
                        {formatLabel(c)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Goals */}
        {profile?.goals?.goalType && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Goals
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#10B981]/5 rounded-xl p-3 text-center">
                <Target className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
                <p className="text-xs text-gray-400 font-medium">Goal</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {formatLabel(profile.goals.goalType)}
                </p>
              </div>
              {profile.goals.targetWeight && (
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Weight className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-400 font-medium">
                    Target Weight
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {profile.goals.targetWeight} kg
                  </p>
                </div>
              )}
              {profile.goals.dailyCalorieTarget && (
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-400 font-medium">
                    Calorie Target
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {profile.goals.dailyCalorieTarget} kcal
                  </p>
                </div>
              )}
              {profile.goals.dailyCalorieBurnTarget && (
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <Activity className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-400 font-medium">
                    Burn Target
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {profile.goals.dailyCalorieBurnTarget} kcal
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editable Metrics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Body & Lifestyle
            </h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#10B981] hover:text-[#0ea572] bg-[#10B981]/10 hover:bg-[#10B981]/20 px-3 py-1.5 rounded-full transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#10B981] hover:bg-[#0ea572] px-3 py-1.5 rounded-full transition-colors disabled:opacity-60"
                >
                  <Check className="w-3.5 h-3.5" />
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Height */}
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-2">
              <Ruler className="w-5 h-5 text-[#10B981]" />
              <p className="text-xs text-gray-400 font-medium">Height</p>
              {editing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={editForm.heightCm}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, heightCm: e.target.value }))
                    }
                    className="w-16 text-center text-sm border border-gray-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-400">cm</span>
                </div>
              ) : (
                <p className="text-lg font-bold text-gray-800">
                  {profile?.profile?.heightCm || "—"}
                  {profile?.profile?.heightCm && (
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      cm
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Weight */}
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-2">
              <Weight className="w-5 h-5 text-blue-500" />
              <p className="text-xs text-gray-400 font-medium">Weight</p>
              {editing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={editForm.weightKg}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, weightKg: e.target.value }))
                    }
                    className="w-16 text-center text-sm border border-gray-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-400">kg</span>
                </div>
              ) : (
                <p className="text-lg font-bold text-gray-800">
                  {profile?.profile?.weightKg || "—"}
                  {profile?.profile?.weightKg && (
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      kg
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Sleep */}
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              <p className="text-xs text-gray-400 font-medium">Sleep</p>
              {editing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={editForm.sleepHours}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, sleepHours: e.target.value }))
                    }
                    className="w-16 text-center text-sm border border-gray-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-400">hrs</span>
                </div>
              ) : (
                <p className="text-lg font-bold text-gray-800">
                  {profile?.lifestyle?.sleepHours || "—"}
                  {profile?.lifestyle?.sleepHours && (
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      hrs
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Water */}
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-500" />
              <p className="text-xs text-gray-400 font-medium">Water</p>
              {editing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={editForm.waterIntakeLiters}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        waterIntakeLiters: e.target.value,
                      }))
                    }
                    className="w-16 text-center text-sm border border-gray-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-400">L</span>
                </div>
              ) : (
                <p className="text-lg font-bold text-gray-800">
                  {profile?.lifestyle?.waterIntakeLiters || "—"}
                  {profile?.lifestyle?.waterIntakeLiters && (
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      L
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
