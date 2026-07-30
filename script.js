// ============================================================
// Config — point this at your running FastAPI server
// ============================================================
const API_BASE_URL = "https://mental-health-score-t751.onrender.com";

// ============================================================
// Element refs
// ============================================================
const form        = document.getElementById("predict-form");
const submitBtn   = document.getElementById("submit-btn");
const errorEl     = document.getElementById("form-error");
const resultEl    = document.getElementById("result");
const resetBtn    = document.getElementById("reset-btn");

const countrySelect   = document.getElementById("country");
const countryOtherWrap= document.getElementById("country-other-wrap");
const countryOtherIn  = document.getElementById("country_other");

const stressGroup = document.getElementById("stress-group");

// ============================================================
// Sliders — keep the numeric readout in sync
// ============================================================
const sliderMap = [
  { input: "Avg_Daily_Usage_Hours", output: "usage-out" },
  { input: "Study_Hours",            output: "study-out" },
  { input: "Physical_Activity_Hours",output: "activity-out" },
  { input: "Sleep_Hours_Per_Night",  output: "sleep-out" },
];

sliderMap.forEach(({ input, output }) => {
  const slider = document.getElementById(input);
  const out = document.getElementById(output);
  const sync = () => { out.textContent = parseFloat(slider.value).toFixed(1); };
  slider.addEventListener("input", sync);
  sync();
});

// ============================================================
// Country "Other" toggle
// ============================================================
countrySelect.addEventListener("change", () => {
  const isOther = countrySelect.value === "__other__";
  countryOtherWrap.classList.toggle("field--hidden", !isOther);
  countryOtherIn.required = isOther;
});

// ============================================================
// Segmented control (Stress level)
// ============================================================
stressGroup.addEventListener("click", (e) => {
  const btn = e.target.closest(".segmented__btn");
  if (!btn) return;
  stressGroup.querySelectorAll(".segmented__btn").forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
});

function getStressValue() {
  return stressGroup.querySelector(".segmented__btn.is-active")?.dataset.value || "Low";
}

// ============================================================
// Build payload matching the FastAPI StudentData schema exactly
// ============================================================
function buildPayload() {
  const country = countrySelect.value === "__other__"
    ? countryOtherIn.value.trim()
    : countrySelect.value;

  return {
    age: parseInt(document.getElementById("age").value, 10),
    gender: document.getElementById("gender").value,
    country: country,
    academic_level: document.getElementById("academic_level").value,
    most_used_platform: document.getElementById("most_used_platform").value,
    purpose_of_use: document.getElementById("purpose_of_use").value,
    Avg_Daily_Usage_Hours: parseFloat(document.getElementById("Avg_Daily_Usage_Hours").value),
    Daily_Unlocks: parseInt(document.getElementById("Daily_Unlocks").value, 10),
    Study_Hours: parseFloat(document.getElementById("Study_Hours").value),
    Physical_Activity_Hours: parseFloat(document.getElementById("Physical_Activity_Hours").value),
    Sleep_Hours_Per_Night: parseFloat(document.getElementById("Sleep_Hours_Per_Night").value),
    Stress_Level: getStressValue(),
  };
}

// ============================================================
// Gauge + band rendering
// Assumes the model's mental health score sits on a 0–10 scale.
// ============================================================
const GAUGE_ARC_LENGTH = 251.2; // matches the SVG path length in index.html

function bandFor(score) {
  if (score <= 3)  return { label: "Strained", copy: "Your habits are showing real strain right now — heavy usage and short sleep tend to compound each other. Small changes to sleep and screen time can move this quickly.", color: "var(--band-low)" };
  if (score <= 5)  return { label: "Uneven",   copy: "Some parts of your routine are supporting you and others are working against you. Worth a closer look at sleep and stress in particular.", color: "var(--band-mid)" };
  if (score <= 7)  return { label: "Steady",   copy: "Your daily rhythm is broadly in balance. Keep an eye on the habits that are borderline so they don't slide.", color: "var(--band-good)" };
  return               { label: "Thriving",  copy: "Your habits are working well together — consistent sleep, activity, and usage patterns that support your wellbeing.", color: "var(--band-high)" };
}

function renderResult(score) {
  const clamped = Math.max(0, Math.min(10, score));
  const fraction = clamped / 10;
  const band = bandFor(clamped);

  const fillPath = document.getElementById("gauge-fill");
  const needle = document.getElementById("gauge-needle");
  const scoreValueEl = document.getElementById("score-value");
  const bandEl = document.getElementById("result-band");
  const copyEl = document.getElementById("result-copy");

  fillPath.style.stroke = band.color;
  bandEl.style.color = band.color;

  // animate on next frame so the transition actually plays
  requestAnimationFrame(() => {
    fillPath.style.strokeDashoffset = String(GAUGE_ARC_LENGTH * (1 - fraction));
    const angle = (fraction - 0.5) * 180;
    needle.style.transform = `rotate(${angle}deg)`;
  });

  scoreValueEl.textContent = score.toFixed(2);
  bandEl.textContent = band.label;
  copyEl.textContent = band.copy;

  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ============================================================
// Submit
// ============================================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.hidden = true;

  const payload = buildPayload();

  if (countrySelect.value === "__other__" && !payload.country) {
    errorEl.textContent = "Please tell us which country you're in.";
    errorEl.hidden = false;
    return;
  }

  submitBtn.disabled = true;
  submitBtn.querySelector(".btn__label").textContent = "Reading the signal…";

  try {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.json().catch(() => null);
      throw new Error(detail?.detail ? JSON.stringify(detail.detail) : `Request failed (${res.status})`);
    }

    const data = await res.json();
    renderResult(data.predicted_mental_health_score);
    form.hidden = true;
  } catch (err) {
    errorEl.textContent = `Couldn't reach the model: ${err.message}. Is the FastAPI server running at ${API_BASE_URL}?`;
    errorEl.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector(".btn__label").textContent = "Reveal my signal";
  }
});

// ============================================================
// Reset
// ============================================================
resetBtn.addEventListener("click", () => {
  resultEl.hidden = true;
  form.hidden = false;
});
