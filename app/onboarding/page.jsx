"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TOTAL_STEPS = 7;

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  { id: "student", label: "Student" },
  { id: "working_professional", label: "Worker" },
  { id: "business_leader", label: "Business" },
];

const GENDER_OPTIONS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
];

const WORK_CATEGORIES = [
  {
    id: "desk",
    label: "Desk / Sitting Job",
    description: "Office, coding, writing, studying",
  },
  {
    id: "field",
    label: "Field / Active Job",
    description: "Sales, delivery, fieldwork",
  },
  {
    id: "physical",
    label: "Physical / Manual Job",
    description: "Construction, gym trainer, labour",
  },
  { id: "wfh", label: "Work From Home", description: "Remote, freelance" },
  {
    id: "student_work",
    label: "Student",
    description: "College, school, coaching",
  },
  {
    id: "standing",
    label: "Standing Job",
    description: "Chef, shopkeeper, receptionist",
  },
  { id: "driving", label: "Driving Job", description: "Cab, truck, delivery" },
];

const POSTURE_ISSUES = [
  { id: "neck_shoulder", label: "Neck / Shoulder pain" },
  { id: "lower_back", label: "Lower back pain" },
  { id: "eye_strain", label: "Eye strain / Headaches" },
  { id: "wrist_hand", label: "Wrist / Hand pain" },
  { id: "stiffness", label: "Occasional stiffness" },
  { id: "none", label: "No issues currently" },
];

const GOAL_OPTIONS = [
  {
    id: "lose_weight",
    label: "Weight Loss",
    description: "Reduce body fat with a calorie deficit plan",
  },
  {
    id: "build_muscle",
    label: "Muscle Gain",
    description: "Build strength with a slight calorie surplus",
  },
  {
    id: "maintain",
    label: "Maintain Weight",
    description: "Stay at your current weight with balanced intake",
  },
];

const HEALTH_CONDITIONS = [
  { id: "diabetes_t1", label: "Diabetes Type 1" },
  { id: "diabetes_t2", label: "Diabetes Type 2" },
  { id: "hypertension", label: "Hypertension" },
  { id: "pcod_pcos", label: "PCOD / PCOS" },
  { id: "thyroid", label: "Thyroid" },
  { id: "anemia", label: "Anemia" },
  { id: "heart_disease", label: "Heart Disease" },
  { id: "cholesterol", label: "High Cholesterol" },
  { id: "kidney_issues", label: "Kidney Issues" },
  { id: "none", label: "None of the above" },
];

const ALLERGY_OPTIONS = [
  { id: "gluten", label: "Gluten" },
  { id: "lactose", label: "Lactose / Dairy" },
  { id: "nuts", label: "Nuts" },
  { id: "eggs", label: "Eggs" },
  { id: "soy", label: "Soy" },
  { id: "seafood", label: "Shellfish / Seafood" },
  { id: "fructose", label: "Fructose" },
  { id: "none", label: "None" },
];

const STEP_META = [
  {
    title: "Who are you?",
    subtitle: "Tell us a bit about yourself to personalize your experience.",
  },
  {
    title: "Your work type",
    subtitle:
      "Helps us understand your daily activity level and posture habits.",
  },
  {
    title: "Physical stats",
    subtitle: "Used to calculate your BMI and daily calorie requirements.",
  },
  {
    title: "Daily habits",
    subtitle: "Helps us fine-tune your sleep and hydration recommendations.",
  },
  {
    title: "Your goal",
    subtitle: "This sets your daily calorie target and exercise burn goal.",
  },
  {
    title: "Health conditions",
    subtitle: "We will personalize your food suggestions based on this.",
  },
  {
    title: "Food allergies",
    subtitle: "We will flag and avoid these in your meal suggestions.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calculateAge(dob) {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getBMIInfo(bmi) {
  if (bmi < 18.5)
    return { label: "Underweight", color: "text-blue-500", barWidth: "15%" };
  if (bmi < 25)
    return { label: "Normal", color: "text-emerald-600", barWidth: "38%" };
  if (bmi < 30)
    return { label: "Overweight", color: "text-yellow-600", barWidth: "65%" };
  return { label: "Obese", color: "text-red-500", barWidth: "88%" };
}

function getSittingLabel(hours) {
  if (hours <= 3) return { text: "Mostly active", color: "text-emerald-600" };
  if (hours <= 6)
    return { text: "Moderately sedentary", color: "text-yellow-600" };
  if (hours <= 10)
    return { text: "Sedentary lifestyle", color: "text-red-500" };
  return {
    text: "High risk posture zone",
    color: "text-red-700 font-semibold",
  };
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i + 1 === current
              ? "w-7 h-2 bg-emerald-600"
              : i + 1 < current
                ? "w-2 h-2 bg-emerald-400"
                : "w-2 h-2 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function SelectCard({ selected, onClick, label, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 p-3 text-left transition-all duration-150 ${
        selected
          ? "border-emerald-600 bg-emerald-50"
          : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50"
      }`}
    >
      <div
        className={`text-sm font-medium ${selected ? "text-emerald-700" : "text-gray-800"}`}
      >
        {label}
      </div>
      {description && (
        <div className="text-xs text-gray-500 mt-0.5 leading-snug">
          {description}
        </div>
      )}
    </button>
  );
}

function Chip({ selected, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-all duration-150 ${
        selected
          ? "bg-emerald-600 text-white border-emerald-600"
          : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700"
      }`}
    >
      {label}
    </button>
  );
}

function SliderInput({
  min,
  max,
  value,
  onChange,
  label,
  displayValue,
  note,
  noteColor,
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-emerald-600">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full accent-emerald-600 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      {note && (
        <p className={`text-xs mt-2 ${noteColor || "text-gray-500"}`}>{note}</p>
      )}
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

function Step1({ form, set }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          I am a
        </p>
        <div className="grid grid-cols-3 gap-3">
          {ROLE_OPTIONS.map((opt) => (
            <SelectCard
              key={opt.id}
              label={opt.label}
              selected={form.roleType === opt.id}
              onClick={() => set("roleType", opt.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Gender
        </p>
        <div className="grid grid-cols-3 gap-3">
          {GENDER_OPTIONS.map((opt) => (
            <SelectCard
              key={opt.id}
              label={opt.label}
              selected={form.gender === opt.id}
              onClick={() => set("gender", opt.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Date of Birth
        </label>
        <input
          type="date"
          value={form.dob}
          onChange={(e) => set("dob", e.target.value)}
          max={
            new Date(Date.now() - 10 * 365.25 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          }
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

function Step2({ form, set, toggleChip }) {
  const showSittingSlider = ["desk", "wfh", "student_work"].includes(
    form.workCategory,
  );
  const sittingLabel = getSittingLabel(form.sittingHours);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Work category
        </p>
        <div className="grid grid-cols-2 gap-2">
          {WORK_CATEGORIES.map((cat) => (
            <SelectCard
              key={cat.id}
              label={cat.label}
              description={cat.description}
              selected={form.workCategory === cat.id}
              onClick={() => set("workCategory", cat.id)}
            />
          ))}
        </div>
      </div>

      {showSittingSlider && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Daily hours of sitting
            </label>
            <span className={`text-xs font-semibold ${sittingLabel.color}`}>
              {form.sittingHours} hrs — {sittingLabel.text}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            value={form.sittingHours}
            onChange={(e) => set("sittingHours", parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 hr</span>
            <span>12+ hrs</span>
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Posture concerns{" "}
          <span className="normal-case font-normal text-gray-400">
            (optional)
          </span>
        </p>
        <p className="text-xs text-gray-400 mb-3">
          We will suggest posture-friendly foods and movement reminders.
        </p>
        <div className="flex flex-wrap gap-2">
          {POSTURE_ISSUES.map((issue) => (
            <Chip
              key={issue.id}
              label={issue.label}
              selected={form.postureIssues.includes(issue.id)}
              onClick={() => toggleChip("postureIssues", issue.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3({ form, set }) {
  const age = form.dob ? calculateAge(form.dob) : null;
  const bmi = useMemo(() => {
    const h = parseFloat(form.heightCm);
    const w = parseFloat(form.weightKg);
    if (!h || !w || h < 50 || w < 10) return null;
    return parseFloat((w / (h / 100) ** 2).toFixed(1));
  }, [form.heightCm, form.weightKg]);
  const bmiInfo = bmi ? getBMIInfo(bmi) : null;

  return (
    <div className="space-y-5">
      {age !== null && age > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          <span>Age from date of birth:</span>
          <span className="font-semibold text-gray-800">{age} years</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            placeholder="e.g. 170"
            value={form.heightCm}
            onChange={(e) => set("heightCm", e.target.value)}
            min={100}
            max={250}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            placeholder="e.g. 65"
            value={form.weightKg}
            onChange={(e) => set("weightKg", e.target.value)}
            min={20}
            max={300}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {bmi !== null && bmiInfo && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">BMI</p>
              <p className="text-2xl font-bold text-gray-900">{bmi}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Category</p>
              <p className={`text-base font-semibold ${bmiInfo.color}`}>
                {bmiInfo.label}
              </p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                bmi < 18.5
                  ? "bg-blue-400"
                  : bmi < 25
                    ? "bg-emerald-500"
                    : bmi < 30
                      ? "bg-yellow-500"
                      : "bg-red-500"
              }`}
              style={{ width: bmiInfo.barWidth }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1.5">
            <span>Underweight</span>
            <span>Normal</span>
            <span>Overweight</span>
            <span>Obese</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Step4({ form, set }) {
  const sleepNote =
    form.sleepHours < 6
      ? {
          text: "Less than 6 hrs can impact metabolism and recovery.",
          color: "text-red-500",
        }
      : form.sleepHours < 7
        ? {
            text: "Aim for at least 7 hours for optimal health.",
            color: "text-yellow-600",
          }
        : {
            text: "Good sleep supports your fitness and nutrition goals.",
            color: "text-emerald-600",
          };

  return (
    <div className="space-y-8">
      <SliderInput
        label="Sleep hours per night"
        min={4}
        max={12}
        value={form.sleepHours}
        onChange={(e) => set("sleepHours", parseInt(e.target.value))}
        displayValue={`${form.sleepHours} hrs`}
        note={sleepNote.text}
        noteColor={sleepNote.color}
      />

      <SliderInput
        label="Daily water intake"
        min={2}
        max={20}
        value={form.waterGlasses}
        onChange={(e) => set("waterGlasses", parseInt(e.target.value))}
        displayValue={`${form.waterGlasses} glasses (${(form.waterGlasses * 0.25).toFixed(1)} L)`}
      />
    </div>
  );
}

function Step5({ form, set }) {
  return (
    <div className="space-y-3">
      {GOAL_OPTIONS.map((goal) => (
        <button
          key={goal.id}
          type="button"
          onClick={() => set("goalType", goal.id)}
          className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-150 ${
            form.goalType === goal.id
              ? "border-emerald-600 bg-emerald-50"
              : "border-gray-200 bg-white hover:border-emerald-300"
          }`}
        >
          <div
            className={`font-semibold text-sm ${
              form.goalType === goal.id ? "text-emerald-700" : "text-gray-800"
            }`}
          >
            {goal.label}
          </div>
          <div className="text-sm text-gray-500 mt-0.5">{goal.description}</div>
        </button>
      ))}
      <p className="text-xs text-gray-400 pt-1">
        Your daily calorie intake target and exercise burn goal will be set
        based on this.
      </p>
    </div>
  );
}

function Step6({ form, toggleChip }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        We will suggest foods rich in nutrients you need and flag potentially
        harmful options.
      </p>
      <div className="flex flex-wrap gap-2">
        {HEALTH_CONDITIONS.map((cond) => (
          <Chip
            key={cond.id}
            label={cond.label}
            selected={form.healthConditions.includes(cond.id)}
            onClick={() => toggleChip("healthConditions", cond.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Step7({ form, set, toggleChip }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        We will automatically flag and avoid these in your meal suggestions.
      </p>
      <div className="flex flex-wrap gap-2">
        {ALLERGY_OPTIONS.map((a) => (
          <Chip
            key={a.id}
            label={a.label}
            selected={form.allergies.includes(a.id)}
            onClick={() => toggleChip("allergies", a.id)}
          />
        ))}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Any other allergy?
        </label>
        <input
          type="text"
          placeholder="Type here..."
          value={form.otherAllergy}
          onChange={(e) => set("otherAllergy", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const INITIAL_FORM = {
  // Step 1
  roleType: "",
  gender: "",
  dob: "",
  // Step 2
  workCategory: "",
  sittingHours: 5,
  postureIssues: [],
  // Step 3
  heightCm: "",
  weightKg: "",
  // Step 4
  sleepHours: 7,
  waterGlasses: 8,
  // Step 5
  goalType: "",
  // Step 6
  healthConditions: [],
  // Step 7
  allergies: [],
  otherAllergy: "",
};

function getActivityLevel(workCategory, sittingHours) {
  if (workCategory === "physical") return "active";
  if (workCategory === "field") return "moderate";
  if (workCategory === "standing") return "moderate";
  if (workCategory === "driving") return "light";
  // desk / wfh / student_work — use sitting hours
  if (sittingHours <= 3) return "light";
  if (sittingHours <= 6) return "moderate";
  return "sedentary";
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleChip = (field, id) => {
    setForm((prev) => {
      const arr = [...prev[field]];
      if (id === "none") {
        return { ...prev, [field]: arr.includes("none") ? [] : ["none"] };
      }
      const filtered = arr.filter((x) => x !== "none");
      if (filtered.includes(id))
        return { ...prev, [field]: filtered.filter((x) => x !== id) };
      return { ...prev, [field]: [...filtered, id] };
    });
  };

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return !!(form.roleType && form.gender && form.dob);
      case 2:
        return !!form.workCategory;
      case 3:
        return !!(form.heightCm && form.weightKg);
      case 4:
        return true;
      case 5:
        return !!form.goalType;
      case 6:
        return true;
      case 7:
        return true;
      default:
        return true;
    }
  }, [step, form]);

  const handleNext = () => {
    if (!canProceed) {
      toast.error("Please complete all required fields before continuing.");
      return;
    }
    if (step === TOTAL_STEPS) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        roleType: form.roleType,
        gender: form.gender,
        dob: form.dob,
        heightCm: parseFloat(form.heightCm),
        weightKg: parseFloat(form.weightKg),
        activityLevel: getActivityLevel(form.workCategory, form.sittingHours),
        sleepHours: form.sleepHours,
        waterIntakeLiters: parseFloat((form.waterGlasses * 0.25).toFixed(1)),
        goalType: form.goalType,
        workCategory: form.workCategory,
        sittingHours: form.sittingHours,
        postureIssues: form.postureIssues,
        healthConditions: form.healthConditions,
        allergies: form.allergies,
        otherAllergy: form.otherAllergy,
      };

      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Setup failed");

      toast.success("Profile setup complete! Welcome to NutriSync.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const meta = STEP_META[step - 1];

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 form={form} set={set} />;
      case 2:
        return <Step2 form={form} set={set} toggleChip={toggleChip} />;
      case 3:
        return <Step3 form={form} set={set} />;
      case 4:
        return <Step4 form={form} set={set} />;
      case 5:
        return <Step5 form={form} set={set} />;
      case 6:
        return <Step6 form={form} toggleChip={toggleChip} />;
      case 7:
        return <Step7 form={form} set={set} toggleChip={toggleChip} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <p className="text-center text-emerald-600 font-bold text-sm tracking-widest uppercase mb-4">
          NutriSync AI
        </p>

        {/* Progress */}
        <ProgressDots current={step} total={TOTAL_STEPS} />

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Step header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-gray-900">{meta.title}</h2>
              <span className="text-xs text-gray-400">
                {step} / {TOTAL_STEPS}
              </span>
            </div>
            <p className="text-sm text-gray-500">{meta.subtitle}</p>
            <div className="mt-4 h-px bg-gray-100" />
          </div>

          {/* Step content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                disabled={submitting}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-40"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed || submitting}
              className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Setting up..."
                : step === TOTAL_STEPS
                  ? "Complete Setup"
                  : "Next"}
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Your data is private and used only to personalize your experience.
        </p>
      </div>
    </div>
  );
}
