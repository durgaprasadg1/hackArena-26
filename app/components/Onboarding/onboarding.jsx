import React, { useState } from "react";

const theme = {
  green: "#1B4332",
  lime: "#86EFAC",
  limeLight: "#DCFCE7",
  bg: "#F9FAFB",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  red: "#EF4444",
  amber: "#F59E0B",
  blue: "#3B82F6",
  lavender: "#8B5CF6",
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #F9FAFB 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    padding: "20px",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "28px",
    boxShadow: "0 25px 60px rgba(27,67,50,0.12), 0 8px 20px rgba(0,0,0,0.06)",
    width: "100%",
    maxWidth: "520px",
    minHeight: "640px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    padding: "24px 28px 0",
  },
  progressTrack: {
    height: "6px",
    background: "#E5E7EB",
    borderRadius: "99px",
    overflow: "hidden",
  },
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg, #1B4332, #86EFAC)",
    borderRadius: "99px",
    transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
  }),
  stepLabel: {
    fontSize: "12px",
    color: theme.muted,
    marginTop: "8px",
    fontWeight: "500",
    letterSpacing: "0.05em",
  },
  dotsRow: {
    display: "flex",
    gap: "6px",
    marginTop: "12px",
  },
  dot: (active, done) => ({
    width: active ? "20px" : "8px",
    height: "8px",
    borderRadius: "99px",
    background: done ? theme.green : active ? theme.lime : "#E5E7EB",
    transition: "all 0.3s ease",
    border: active ? `2px solid ${theme.green}` : "none",
  }),
  body: {
    flex: 1,
    padding: "24px 28px",
    overflowY: "auto",
  },
  iconBox: {
    width: "72px",
    height: "72px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #DCFCE7, #BBF7D0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    marginBottom: "20px",
    boxShadow: "0 4px 14px rgba(134,239,172,0.4)",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: theme.text,
    marginBottom: "6px",
    fontFamily: "'Sora', sans-serif",
    lineHeight: "1.3",
  },
  subtext: {
    fontSize: "14px",
    color: theme.muted,
    marginBottom: "24px",
    lineHeight: "1.6",
  },
  radioGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    marginBottom: "20px",
  },
  radioCard: (selected) => ({
    padding: "16px 10px",
    borderRadius: "16px",
    border: `2px solid ${selected ? theme.green : theme.border}`,
    background: selected ? "#F0FDF4" : "#FAFAFA",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s ease",
    transform: selected ? "scale(1.02)" : "scale(1)",
    boxShadow: selected ? "0 4px 12px rgba(27,67,50,0.15)" : "none",
  }),
  radioEmoji: {
    fontSize: "28px",
    marginBottom: "6px",
  },
  radioLabel: (selected) => ({
    fontSize: "12px",
    fontWeight: "600",
    color: selected ? theme.green : theme.text,
  }),
  radioSub: {
    fontSize: "10px",
    color: theme.muted,
    marginTop: "2px",
    lineHeight: "1.3",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: theme.text,
    marginBottom: "8px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${theme.border}`,
    fontSize: "15px",
    color: theme.text,
    outline: "none",
    background: "#FAFAFA",
    boxSizing: "border-box",
    transition: "border 0.2s",
  },
  sliderWrap: {
    marginBottom: "20px",
  },
  sliderLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  sliderValue: (color) => ({
    fontSize: "13px",
    fontWeight: "700",
    color: color,
    background: color + "15",
    padding: "3px 10px",
    borderRadius: "99px",
  }),
  slider: {
    width: "100%",
    accentColor: theme.green,
    cursor: "pointer",
  },
  chipGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  },
  chip: (selected, color) => ({
    padding: "8px 14px",
    borderRadius: "99px",
    border: `1.5px solid ${selected ? (color || theme.green) : theme.border}`,
    background: selected ? (color || theme.green) + "15" : "#FAFAFA",
    color: selected ? (color || theme.green) : theme.muted,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    userSelect: "none",
  }),
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: theme.text,
    marginBottom: "10px",
    marginTop: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  infoNote: (color) => ({
    background: (color || theme.green) + "10",
    border: `1px solid ${(color || theme.green)}30`,
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "13px",
    color: color || theme.green,
    marginTop: "16px",
    lineHeight: "1.5",
  }),
  footer: {
    padding: "16px 28px 28px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  btnPrimary: {
    flex: 1,
    padding: "15px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.02em",
    boxShadow: "0 4px 14px rgba(27,67,50,0.3)",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  btnSkip: {
    padding: "15px 20px",
    borderRadius: "14px",
    background: "transparent",
    color: theme.muted,
    fontSize: "14px",
    fontWeight: "600",
    border: `1.5px solid ${theme.border}`,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  workGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "20px",
  },
  workCard: (selected) => ({
    padding: "14px 12px",
    borderRadius: "16px",
    border: `2px solid ${selected ? theme.green : theme.border}`,
    background: selected ? "#F0FDF4" : "#FAFAFA",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.2s ease",
    boxShadow: selected ? "0 4px 12px rgba(27,67,50,0.15)" : "none",
  }),
  workEmoji: {
    fontSize: "22px",
    flexShrink: 0,
  },
  workText: (selected) => ({
    fontSize: "13px",
    fontWeight: "600",
    color: selected ? theme.green : theme.text,
    lineHeight: "1.3",
  }),
  workSub: {
    fontSize: "11px",
    color: theme.muted,
    marginTop: "1px",
  },
  goalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
    marginBottom: "20px",
  },
  goalCard: (selected) => ({
    padding: "18px 20px",
    borderRadius: "16px",
    border: `2px solid ${selected ? theme.green : theme.border}`,
    background: selected ? "#F0FDF4" : "#FAFAFA",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    transition: "all 0.2s ease",
    boxShadow: selected ? "0 4px 12px rgba(27,67,50,0.15)" : "none",
  }),
  locationBox: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: `1.5px solid ${theme.border}`,
    background: "#FAFAFA",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    marginBottom: "12px",
    fontSize: "14px",
    color: theme.muted,
    fontWeight: "500",
  },
};

const getSittingLabel = (val) => {
  if (val <= 3) return { text: "Mostly active 🟢", color: "#16A34A" };
  if (val <= 6) return { text: "Moderately sedentary 🟡", color: "#D97706" };
  if (val <= 10) return { text: "Sedentary lifestyle 🔴", color: "#DC2626" };
  return { text: "High risk posture zone ⚠️", color: "#DC2626" };
};

// ─── STEP COMPONENTS ───────────────────────────────────────────

function Step1({ data, setData }) {
  const roles = [
    { id: "student", emoji: "🎓", label: "Student" },
    { id: "worker", emoji: "💼", label: "Worker" },
    { id: "business", emoji: "🏢", label: "Business" },
  ];
  return (
    <div>
      <div style={styles.iconBox}>👤</div>
      <div style={styles.heading}>Who are you?</div>
      <div style={styles.subtext}>Tell us a bit about yourself so we can personalize your experience.</div>
      <div style={styles.radioGrid}>
        {roles.map((r) => (
          <div key={r.id} style={styles.radioCard(data.role === r.id)} onClick={() => setData({ ...data, role: r.id })}>
            <div style={styles.radioEmoji}>{r.emoji}</div>
            <div style={styles.radioLabel(data.role === r.id)}>{r.label}</div>
          </div>
        ))}
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Date of Birth</label>
        <input style={styles.input} type="date" value={data.dob || ""} onChange={(e) => setData({ ...data, dob: e.target.value })} />
      </div>
    </div>
  );
}

function Step2({ data, setData }) {
  const workTypes = [
    { id: "desk", emoji: "🪑", label: "Desk / Sitting Job", sub: "Office, coding, writing" },
    { id: "field", emoji: "🏃", label: "Field / Active Job", sub: "Sales, delivery, fieldwork" },
    { id: "physical", emoji: "🏋️", label: "Physical / Manual", sub: "Construction, gym trainer" },
    { id: "wfh", emoji: "🏠", label: "Work From Home", sub: "Remote, freelance" },
    { id: "student", emoji: "🎓", label: "Student", sub: "College, school, coaching" },
    { id: "standing", emoji: "🍳", label: "Standing Job", sub: "Chef, shopkeeper" },
    { id: "driving", emoji: "🚗", label: "Driving Job", sub: "Cab, truck, delivery" },
  ];
  const postureIssues = [
    { id: "neck", label: "Neck / shoulder pain", color: theme.red },
    { id: "back", label: "Lower back pain", color: theme.red },
    { id: "eyes", label: "Eye strain / headaches", color: theme.red },
    { id: "wrist", label: "Wrist / hand pain", color: theme.red },
    { id: "stiff", label: "Occasional stiffness", color: theme.amber },
    { id: "none", label: "No issues currently", color: "#16A34A" },
  ];
  const showSitting = ["desk", "wfh", "student"].includes(data.workType);
  const sittingInfo = getSittingLabel(data.sittingHours || 4);

  const togglePosture = (id) => {
    const cur = data.postureIssues || [];
    setData({ ...data, postureIssues: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  };

  return (
    <div>
      <div style={styles.iconBox}>🪑</div>
      <div style={styles.heading}>What kind of work do you do?</div>
      <div style={styles.subtext}>Helps us understand your activity level and posture habits.</div>
      <div style={styles.sectionTitle}>Work Category</div>
      <div style={styles.workGrid}>
        {workTypes.map((w) => (
          <div key={w.id} style={styles.workCard(data.workType === w.id)} onClick={() => setData({ ...data, workType: w.id })}>
            <span style={styles.workEmoji}>{w.emoji}</span>
            <div>
              <div style={styles.workText(data.workType === w.id)}>{w.label}</div>
              <div style={styles.workSub}>{w.sub}</div>
            </div>
          </div>
        ))}
      </div>
      {showSitting && (
        <div style={styles.sliderWrap}>
          <div style={styles.sliderLabel}>
            <span style={styles.label}>Daily Hours of Sitting</span>
            <span style={styles.sliderValue(sittingInfo.color)}>{sittingInfo.text}</span>
          </div>
          <input style={styles.slider} type="range" min="1" max="13" value={data.sittingHours || 4}
            onChange={(e) => setData({ ...data, sittingHours: Number(e.target.value) })} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: theme.muted, marginTop: "4px" }}>
            <span>1 hr</span><span>{data.sittingHours || 4} hrs</span><span>12+ hrs</span>
          </div>
        </div>
      )}
      <div style={styles.sectionTitle}>Posture Check <span style={{ color: theme.muted, textTransform: "none", fontWeight: "400" }}>(optional)</span></div>
      <div style={{ fontSize: "13px", color: theme.muted, marginBottom: "10px" }}>Do you experience any of these?</div>
      <div style={styles.chipGrid}>
        {postureIssues.map((p) => (
          <div key={p.id} style={styles.chip((data.postureIssues || []).includes(p.id), p.color)}
            onClick={() => togglePosture(p.id)}>{p.label}</div>
        ))}
      </div>
      <div style={styles.infoNote()}>🧘 We'll suggest posture-friendly foods and movement reminders based on your work style.</div>
    </div>
  );
}

function Step3({ data, setData }) {
  const dob = data.dob;
  const age = dob ? Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 3600 * 1000)) : "";
  return (
    <div>
      <div style={styles.iconBox}>📏</div>
      <div style={styles.heading}>Your Physical Stats</div>
      <div style={styles.subtext}>We'll use this to calculate your BMI and daily calorie needs.</div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Height (cm)</label>
        <input style={styles.input} type="number" placeholder="e.g. 170" value={data.height || ""}
          onChange={(e) => setData({ ...data, height: e.target.value })} />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Weight (kg)</label>
        <input style={styles.input} type="number" placeholder="e.g. 65" value={data.weight || ""}
          onChange={(e) => setData({ ...data, weight: e.target.value })} />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Age</label>
        <input style={styles.input} type="number" placeholder="Auto-calculated from DOB" value={data.age || age || ""}
          onChange={(e) => setData({ ...data, age: e.target.value })} />
      </div>
      {data.height && data.weight && (
        <div style={{ ...styles.infoNote(), background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1D4ED8" }}>
          📊 BMI: <strong>{(data.weight / ((data.height / 100) ** 2)).toFixed(1)}</strong> — will be shown on your profile page
        </div>
      )}
    </div>
  );
}

function Step4({ data, setData }) {
  return (
    <div>
      <div style={styles.iconBox}>💧</div>
      <div style={styles.heading}>Your Daily Habits</div>
      <div style={styles.subtext}>Help us understand your sleep and hydration baseline.</div>
      <div style={styles.sliderWrap}>
        <div style={styles.sliderLabel}>
          <span style={styles.label}>Sleep Hours per Night</span>
          <span style={styles.sliderValue("#7C3AED")}>{data.sleep || 7} hrs</span>
        </div>
        <input style={{ ...styles.slider, accentColor: "#7C3AED" }} type="range" min="2" max="12" value={data.sleep || 7}
          onChange={(e) => setData({ ...data, sleep: Number(e.target.value) })} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: theme.muted, marginTop: "4px" }}>
          <span>2 hrs</span><span>12 hrs</span>
        </div>
      </div>
      <div style={styles.sliderWrap}>
        <div style={styles.sliderLabel}>
          <span style={styles.label}>Daily Water Intake</span>
          <span style={styles.sliderValue(theme.blue)}>{data.water || 6} glasses</span>
        </div>
        <input style={{ ...styles.slider, accentColor: theme.blue }} type="range" min="1" max="16" value={data.water || 6}
          onChange={(e) => setData({ ...data, water: Number(e.target.value) })} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: theme.muted, marginTop: "4px" }}>
          <span>1 glass</span><span>16 glasses (~4L)</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
        <div style={{ background: "#F5F3FF", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "28px" }}>😴</div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#7C3AED", fontFamily: "'Sora', sans-serif" }}>{data.sleep || 7}h</div>
          <div style={{ fontSize: "12px", color: theme.muted }}>Sleep</div>
        </div>
        <div style={{ background: "#EFF6FF", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "28px" }}>💧</div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: theme.blue, fontFamily: "'Sora', sans-serif" }}>{data.water || 6}gl</div>
          <div style={{ fontSize: "12px", color: theme.muted }}>Water</div>
        </div>
      </div>
    </div>
  );
}

function Step5({ data, setData }) {
  const goals = [
    { id: "loss", emoji: "⚖️", label: "Weight Loss", sub: "Burn fat, feel lighter" },
    { id: "muscle", emoji: "💪", label: "Muscle Gain", sub: "Build strength & mass" },
    { id: "maintain", emoji: "🎯", label: "Maintain", sub: "Stay fit & balanced" },
  ];
  return (
    <div>
      <div style={styles.iconBox}>🎯</div>
      <div style={styles.heading}>What's your goal?</div>
      <div style={styles.subtext}>This is optional — you can always update it later from your profile.</div>
      <div style={styles.goalGrid}>
        {goals.map((g) => (
          <div key={g.id} style={styles.goalCard(data.goal === g.id)} onClick={() => setData({ ...data, goal: g.id })}>
            <span style={{ fontSize: "32px" }}>{g.emoji}</span>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: data.goal === g.id ? theme.green : theme.text }}>{g.label}</div>
              <div style={{ fontSize: "13px", color: theme.muted, marginTop: "2px" }}>{g.sub}</div>
            </div>
            {data.goal === g.id && <span style={{ marginLeft: "auto", color: theme.green, fontSize: "20px" }}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Step6({ data, setData }) {
  const conditions = ["Diabetes Type 1", "Diabetes Type 2", "Hypertension", "PCOD / PCOS", "Thyroid", "Anemia", "Heart Disease", "Cholesterol", "Kidney Issues", "None of the above"];
  const toggle = (c) => {
    const cur = data.conditions || [];
    if (c === "None of the above") { setData({ ...data, conditions: ["None of the above"] }); return; }
    const filtered = cur.filter((x) => x !== "None of the above");
    setData({ ...data, conditions: filtered.includes(c) ? filtered.filter((x) => x !== c) : [...filtered, c] });
  };
  return (
    <div>
      <div style={styles.iconBox}>🩺</div>
      <div style={styles.heading}>Any health conditions?</div>
      <div style={styles.subtext}>We'll suggest foods rich in the nutrients you specifically need.</div>
      <div style={styles.chipGrid}>
        {conditions.map((c) => (
          <div key={c} style={styles.chip((data.conditions || []).includes(c))} onClick={() => toggle(c)}>{c}</div>
        ))}
      </div>
      <div style={styles.infoNote()}>💊 Your condition-specific nutrition plan will be ready after setup.</div>
    </div>
  );
}

function Step7({ data, setData }) {
  const allergies = ["Gluten", "Lactose / Dairy", "Nuts", "Eggs", "Soy", "Shellfish / Seafood", "Fructose", "None"];
  const toggle = (a) => {
    const cur = data.allergies || [];
    if (a === "None") { setData({ ...data, allergies: ["None"] }); return; }
    const filtered = cur.filter((x) => x !== "None");
    setData({ ...data, allergies: filtered.includes(a) ? filtered.filter((x) => x !== a) : [...filtered, a] });
  };
  return (
    <div>
      <div style={{ ...styles.iconBox, background: "linear-gradient(135deg, #FEE2E2, #FECACA)" }}>⚠️</div>
      <div style={styles.heading}>Any food allergies?</div>
      <div style={styles.subtext}>We'll automatically flag and avoid these in all your meal suggestions.</div>
      <div style={styles.chipGrid}>
        {allergies.map((a) => (
          <div key={a} style={styles.chip((data.allergies || []).includes(a), theme.red)} onClick={() => toggle(a)}>{a}</div>
        ))}
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Any other allergy?</label>
        <input style={styles.input} placeholder="Type here..." value={data.otherAllergy || ""}
          onChange={(e) => setData({ ...data, otherAllergy: e.target.value })} />
      </div>
      <div style={styles.infoNote(theme.red)}>⚠️ Foods containing your allergens will be flagged with a red warning badge throughout the app.</div>
    </div>
  );
}

function Step8({ data, setData }) {
  return (
    <div>
      <div style={styles.iconBox}>📍</div>
      <div style={styles.heading}>Where are you based?</div>
      <div style={styles.subtext}>We'll suggest nearby restaurants & dhabas that perfectly match your diet.</div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Search your city</label>
        <input style={styles.input} placeholder="e.g. Mumbai, Delhi, Pune..." value={data.city || ""}
          onChange={(e) => setData({ ...data, city: e.target.value })} />
      </div>
      <div style={{ textAlign: "center", color: theme.muted, fontSize: "13px", margin: "12px 0" }}>— or —</div>
      <div style={styles.locationBox} onClick={() => setData({ ...data, city: "Using current location 📍" })}>
        <span style={{ fontSize: "20px" }}>📍</span>
        <span>Use my current location</span>
      </div>
      {data.city && (
        <div style={{ ...styles.infoNote(), background: "#F0FDF4", border: "1px solid #BBF7D0", color: theme.green }}>
          ✅ Location set: <strong>{data.city}</strong>
        </div>
      )}
      <div style={{ ...styles.infoNote(), marginTop: "12px" }}>
        🍽 We'll show you nearby food places that match your calorie goals, health conditions, and avoid your allergens.
      </div>
    </div>
  );
}

// ─── COMPLETION SCREEN ──────────────────────────────────────────

function CompletionScreen() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", textAlign: "center" }}>
      <div style={{ fontSize: "72px", marginBottom: "20px", animation: "bounce 0.6s ease" }}>🎉</div>
      <div style={{ fontSize: "26px", fontWeight: "800", color: theme.green, fontFamily: "'Sora', sans-serif", marginBottom: "10px" }}>You're all set!</div>
      <div style={{ fontSize: "15px", color: theme.muted, lineHeight: "1.6", marginBottom: "32px" }}>
        Your personalized NutriSync AI plan is ready. Let's start your health journey!
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", width: "100%", marginBottom: "24px" }}>
        {[["🍽", "Meal Plan"], ["💪", "Exercise"], ["🩺", "Health Tips"], ["📍", "Nearby Food"]].map(([e, l]) => (
          <div key={l} style={{ background: "#F0FDF4", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "24px" }}>{e}</div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: theme.green, marginTop: "4px" }}>{l}</div>
          </div>
        ))}
      </div>
      <button style={{ ...styles.btnPrimary, width: "100%", fontSize: "16px" }} onClick={() => window.location.href = '/'}>
        Go to Home 🏠
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────

const STEPS = [
  { title: "Identity", component: Step1 },
  { title: "Work & Posture", component: Step2 },
  { title: "Physical Stats", component: Step3 },
  { title: "Daily Habits", component: Step4 },
  { title: "Your Goal", component: Step5 },
  { title: "Health Conditions", component: Step6 },
  { title: "Allergies", component: Step7 },
  { title: "Location", component: Step8 },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({});

  const total = STEPS.length;
  const pct = ((step + 1) / total) * 100;
  const StepComp = STEPS[step]?.component;
  const isLastStep = step === total - 1;
  const isGoalStep = step === 4;

  const next = () => {
    if (isLastStep) { setDone(true); return; }
    setStep((s) => s + 1);
  };
  const back = () => { if (step > 0) setStep((s) => s - 1); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=range] { -webkit-appearance: none; height: 6px; border-radius: 99px; background: #E5E7EB; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #1B4332; cursor: pointer; box-shadow: 0 2px 6px rgba(27,67,50,0.3); }
        input:focus { border-color: #86EFAC !important; box-shadow: 0 0 0 3px rgba(134,239,172,0.2); }
        button:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(27,67,50,0.35) !important; }
        button:active { transform: translateY(0); }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        .step-anim { animation: slideIn 0.35s ease; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #BBF7D0; border-radius: 99px; }
      `}</style>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          {done ? (
            <CompletionScreen />
          ) : (
            <>
              {/* Progress */}
              <div style={styles.progressBar}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: theme.green, fontFamily: "'Sora',sans-serif" }}>
                    NutriSync <span style={{ color: theme.lime }}>AI</span>
                  </span>
                  <span style={styles.stepLabel}>Step {step + 1} of {total}</span>
                </div>
                <div style={styles.progressTrack}>
                  <div style={styles.progressFill(pct)} />
                </div>
                <div style={styles.dotsRow}>
                  {STEPS.map((_, i) => (
                    <div key={i} style={styles.dot(i === step, i < step)} />
                  ))}
                </div>
                <div style={{ fontSize: "11px", color: theme.muted, marginTop: "6px", fontWeight: "600" }}>
                  {STEPS[step].title}
                </div>
              </div>

              {/* Body */}
              <div style={styles.body} className="step-anim" key={step}>
                <StepComp data={formData} setData={setFormData} />
              </div>

              {/* Footer */}
              <div style={styles.footer}>
                {step > 0 && (
                  <button style={{ ...styles.btnSkip, flex: "0 0 auto" }} onClick={back}>← Back</button>
                )}
                {isGoalStep && (
                  <button style={styles.btnSkip} onClick={next}>Skip</button>
                )}
                <button style={styles.btnPrimary} onClick={next}>
                  {isLastStep ? "Let's Go! 🚀" : "Next →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
