import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

// ── helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

/** Render a Chart.js config to an off-screen canvas and return the PNG data-URL */
async function renderChartToDataUrl(config, width = 600, height = 300) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  let chart;
  try {
    chart = new Chart(ctx, {
      ...config,
      options: {
        ...config.options,
        animation: false, // valid in the initial config; no mutation after creation
        responsive: false, // prevent resize-observer interference
      },
    });
    chart.draw(); // explicit synchronous render pass
    return canvas.toDataURL("image/png");
  } catch (_) {
    return null;
  } finally {
    chart?.destroy();
  }
}

// ── colour palette (emerald) ─────────────────────────────────────────────────
const EMERALD = "#059669";
const EMERALD_LIGHT = "#6ee7b7";
const TEAL = "#0d9488";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const GRAY = "#6b7280";

// ── section header helper ─────────────────────────────────────────────────────
function sectionHeader(doc, text, y) {
  const [r, g, b] = hexToRgb(EMERALD);
  doc.setFillColor(r, g, b);
  doc.roundedRect(14, y, 182, 7, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(text.toUpperCase(), 18, y + 4.8);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  return y + 11;
}

// ── Stat box row helper ───────────────────────────────────────────────────────
function statBox(doc, items, y) {
  const boxW = 182 / items.length;
  items.forEach((item, i) => {
    const x = 14 + i * boxW;
    doc.setFillColor(240, 253, 244); // very light emerald
    doc.roundedRect(x + 1, y, boxW - 2, 16, 2, 2, "F");
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb(EMERALD));
    doc.text(String(item.value), x + boxW / 2, y + 8, { align: "center" });
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(item.label, x + boxW / 2, y + 13, { align: "center" });
  });
  doc.setTextColor(0, 0, 0);
  return y + 20;
}

// ── main export ───────────────────────────────────────────────────────────────
export async function generateDailyReport(reportData) {
  const { dateLabel, user, meals, mealTotals, exercises, exerciseTotals } =
    reportData;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  let y = 0;

  // ── Cover / Header ──────────────────────────────────────────────────────────
  const [er, eg, eb] = hexToRgb(EMERALD);
  doc.setFillColor(er, eg, eb);
  doc.rect(0, 0, pageW, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("NutriSync AI", 14, 13);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Daily Health Report", 14, 20);
  doc.setFontSize(9);
  doc.text(dateLabel, 14, 27);

  // right-side user info
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(user.name || "User", pageW - 14, 15, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Calorie Goal: ${user.dailyCalorieTarget} kcal`, pageW - 14, 21, {
    align: "right",
  });
  doc.text(
    `Goal: ${(user.goalType || "").replace(/_/g, " ")}`,
    pageW - 14,
    27,
    { align: "right" },
  );

  doc.setTextColor(0, 0, 0);
  y = 38;

  // ── Calorie Overview stat boxes ─────────────────────────────────────────────
  y = sectionHeader(doc, "Calorie Overview", y);
  const netCal = mealTotals.calories - exerciseTotals.caloriesBurned;
  const pct = user.dailyCalorieTarget
    ? Math.round((mealTotals.calories / user.dailyCalorieTarget) * 100)
    : 0;
  y = statBox(
    doc,
    [
      { value: `${mealTotals.calories}`, label: "kcal Consumed" },
      { value: `${user.dailyCalorieTarget}`, label: "kcal Goal" },
      { value: `${exerciseTotals.caloriesBurned}`, label: "kcal Burned" },
      { value: `${netCal}`, label: "Net kcal" },
      { value: `${pct}%`, label: "Goal Completion" },
    ],
    y,
  );

  // ── Calorie bar chart (intake vs goal vs burned) ────────────────────────────
  const calorieBarDataUrl = await renderChartToDataUrl(
    {
      type: "bar",
      data: {
        labels: ["Consumed", "Goal", "Burned", "Net"],
        datasets: [
          {
            data: [
              mealTotals.calories,
              user.dailyCalorieTarget,
              exerciseTotals.caloriesBurned,
              netCal,
            ],
            backgroundColor: [
              EMERALD,
              TEAL,
              AMBER,
              netCal <= user.dailyCalorieTarget ? BLUE : RED,
            ],
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
          x: { grid: { display: false } },
        },
      },
    },
    700,
    280,
  );

  if (calorieBarDataUrl) {
    doc.addImage(calorieBarDataUrl, "PNG", 14, y, 120, 50);
  }

  // ── Macros doughnut chart ───────────────────────────────────────────────────
  const macroDataUrl = await renderChartToDataUrl(
    {
      type: "doughnut",
      data: {
        labels: ["Protein", "Carbs", "Fat"],
        datasets: [
          {
            data: [mealTotals.protein, mealTotals.carbs, mealTotals.fat],
            backgroundColor: [EMERALD, TEAL, AMBER],
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { size: 11 }, boxWidth: 12 },
          },
        },
      },
    },
    320,
    280,
  );

  if (macroDataUrl) {
    doc.addImage(macroDataUrl, "PNG", 138, y, 58, 50);

    // small label under doughnut
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Macros Distribution", 167, y + 53, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  y = y + 56;

  // ── Macro detail row ────────────────────────────────────────────────────────
  y = sectionHeader(doc, "Macronutrient Breakdown", y);
  y = statBox(
    doc,
    [
      { value: `${mealTotals.protein}g`, label: "Protein" },
      { value: `${mealTotals.carbs}g`, label: "Carbs" },
      { value: `${mealTotals.fat}g`, label: "Fat" },
      { value: `${mealTotals.fiber}g`, label: "Fiber" },
      { value: `${mealTotals.sugar}g`, label: "Sugar" },
    ],
    y,
  );

  // ── Meal Log Table ──────────────────────────────────────────────────────────
  y = sectionHeader(doc, "Meal Log", y);

  const mealRows = [];
  for (const [mealType, entries] of Object.entries(meals)) {
    if (entries && entries.length > 0) {
      entries.forEach((entry) => {
        mealRows.push([
          mealType.charAt(0).toUpperCase() + mealType.slice(1),
          entry.foodName || "—",
          `${entry.quantity || 1} ${entry.servingSize?.unit || "serving"}`,
          `${Math.round(entry.nutritionConsumed?.calories || 0)}`,
          `${Math.round(entry.nutritionConsumed?.protein || 0)}g`,
          `${Math.round(entry.nutritionConsumed?.carbs || 0)}g`,
          `${Math.round(entry.nutritionConsumed?.fat || 0)}g`,
        ]);
      });
    }
  }

  if (mealRows.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["Meal", "Food", "Qty", "Cal", "Protein", "Carbs", "Fat"]],
      body: mealRows,
      theme: "striped",
      styles: { fontSize: 7.5, cellPadding: 2 },
      headStyles: {
        fillColor: [5, 150, 105],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 7.5,
      },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 20 },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 6;
  } else {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("No meals logged for this day.", 14, y + 4);
    doc.setTextColor(0, 0, 0);
    y += 10;
  }

  // Check if we need a new page
  if (y > pageH - 80) {
    doc.addPage();
    y = 16;
  }

  // ── Exercise section ────────────────────────────────────────────────────────
  y = sectionHeader(doc, "Exercise Log", y);

  if (exercises && exercises.length > 0) {
    // Exercise stats
    y = statBox(
      doc,
      [
        { value: `${exerciseTotals.exerciseCount}`, label: "Exercises" },
        {
          value: `${exerciseTotals.durationMinutes} min`,
          label: "Total Duration",
        },
        { value: `${exerciseTotals.caloriesBurned}`, label: "kcal Burned" },
      ],
      y,
    );

    // Exercise table
    const exerciseRows = exercises.map((ex) => [
      ex.name,
      ex.type || "—",
      ex.sets ? String(ex.sets) : "—",
      ex.durationMinutes ? `${ex.durationMinutes} min` : "—",
      `${ex.caloriesBurned} kcal`,
      ex.notes || "—",
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Exercise", "Type", "Sets", "Duration", "Cal Burned", "Notes"]],
      body: exerciseRows,
      theme: "striped",
      styles: { fontSize: 7.5, cellPadding: 2 },
      headStyles: {
        fillColor: [5, 150, 105],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 7.5,
      },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      columnStyles: {
        4: { halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 6;

    // Exercise calorie bar chart
    if (y < pageH - 70) {
      const exerciseNames = exercises.map((e) =>
        e.name.length > 14 ? e.name.slice(0, 12) + "…" : e.name,
      );
      const exerciseCals = exercises.map((e) => e.caloriesBurned);

      const exChartDataUrl = await renderChartToDataUrl(
        {
          type: "bar",
          data: {
            labels: exerciseNames,
            datasets: [
              {
                label: "Calories Burned",
                data: exerciseCals,
                backgroundColor: TEAL,
                borderRadius: 5,
                borderSkipped: false,
              },
            ],
          },
          options: {
            indexAxis: "y",
            plugins: { legend: { display: false } },
            scales: {
              x: { beginAtZero: true, grid: { color: "#e5e7eb" } },
              y: { grid: { display: false } },
            },
          },
        },
        700,
        Math.max(180, exercises.length * 40 + 40),
      );

      if (exChartDataUrl) {
        const chartH = Math.min(55, exercises.length * 10 + 20);
        if (y + chartH > pageH - 20) {
          doc.addPage();
          y = 16;
        }
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.text("Calories Burned by Exercise", 14, y + 3);
        doc.setTextColor(0, 0, 0);
        doc.addImage(exChartDataUrl, "PNG", 14, y + 5, 130, chartH);
        y = y + chartH + 10;
      }
    }
  } else {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("No exercise logged for this day.", 14, y + 4);
    doc.setTextColor(0, 0, 0);
    y += 10;
  }

  // ── Net Calorie Balance chart ───────────────────────────────────────────────
  if (y < pageH - 65) {
    y = sectionHeader(doc, "Net Calorie Balance", y);

    const netChartDataUrl = await renderChartToDataUrl(
      {
        type: "bar",
        data: {
          labels: ["Consumed", "Goal", "Burned", "Net"],
          datasets: [
            {
              data: [
                mealTotals.calories,
                user.dailyCalorieTarget,
                exerciseTotals.caloriesBurned,
                netCal,
              ],
              backgroundColor: [
                `${EMERALD}cc`,
                `${TEAL}cc`,
                `${AMBER}cc`,
                netCal <= user.dailyCalorieTarget ? `${BLUE}cc` : `${RED}cc`,
              ],
              borderColor: [
                EMERALD,
                TEAL,
                AMBER,
                netCal <= user.dailyCalorieTarget ? BLUE : RED,
              ],
              borderWidth: 2,
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
          scales: {
            y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
            x: { grid: { display: false } },
          },
        },
      },
      700,
      280,
    );

    if (netChartDataUrl) {
      doc.addImage(netChartDataUrl, "PNG", 14, y, 120, 50);
      y += 54;
    }
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageH - 10, pageW, 10, "F");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `NutriSync AI Daily Report  •  ${dateLabel}  •  Page ${i} of ${totalPages}`,
      pageW / 2,
      pageH - 4,
      { align: "center" },
    );
  }

  // Download
  const fileName = `NutriSync_Report_${dateLabel.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  doc.save(fileName);
}
