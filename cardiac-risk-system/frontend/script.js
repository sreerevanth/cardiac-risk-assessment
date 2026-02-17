/* =========================
   THEME SWITCH
========================= */
function setTheme(theme) {
  document.body.classList.remove("theme-light", "theme-dark", "theme-contrast");
  document.body.classList.add(`theme-${theme}`);
}

/* =========================
   STATE ELEMENTS
========================= */
const idleState = document.getElementById("idleState");
const loadingState = document.getElementById("loadingState");
const resultState = document.getElementById("resultState");

/* =========================
   DRAW CIRCULAR RISK METER
========================= */
function drawRiskMeter(percent) {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;

  const ctx = canvas.getContext("2d");
  const center = 100;
  const radius = 70;

  ctx.lineWidth = 12;
  ctx.strokeStyle = "#1f2937";
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.stroke();

  const angle = (percent / 100) * Math.PI * 2;
  ctx.strokeStyle =
    percent < 30 ? "#22c55e" :
    percent < 60 ? "#eab308" :
    "#ef4444";

  ctx.beginPath();
  ctx.arc(center, center, radius, -Math.PI / 2, angle - Math.PI / 2);
  ctx.stroke();

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "20px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${percent}%`, center, center + 8);

  return canvas;
}

/* =========================
   FORM SUBMIT
========================= */
document.getElementById("healthForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  idleState.classList.add("hidden");
  resultState.classList.add("hidden");
  loadingState.classList.remove("hidden");

  const data = {
    age: +document.getElementById("age").value,
    max_heart_rate: +document.getElementById("pulse").value,
    systolic_bp: +document.getElementById("bp").value,
    cholesterol: +document.getElementById("chol").value,
    fasting_sugar: +document.getElementById("sugar").value,
    exercise_angina: +document.getElementById("chest").value,
    height: +document.getElementById("height").value,
    weight: +document.getElementById("weight").value
  };

  try {
    const res = await fetch("http://127.0.0.1:8000/assess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const out = await res.json();

    setTimeout(() => {
      loadingState.classList.add("hidden");
      resultState.classList.remove("hidden");

      resultState.innerHTML = `
        <h2>Your Snapshot</h2>

        <p><strong>BMI</strong> · ${out.bmi}</p>
        <p><strong>Risk Level</strong> · ${out.risk_level}</p>
        <p><strong>Vulnerability</strong> · ${out.risk_probability}%</p>

        <div class="risk-visual" id="riskVisual"></div>

        <p style="margin-top:18px; font-size:13px; color:var(--muted)">
          This assessment is generated using an AI-assisted clinical risk model.
        </p>

        <div id="aiAdviceLoading" style="margin-top:20px; text-align:center">
            <div class="ai-loader"></div>
                <p style="color:var(--muted); font-size:14px">
                    AI doctor reviewing insights
                </p>
            </div>
        <div id="aiAdvice" class="ai-advice" style="display:none; margin-top:16px;"></div>

      `;

      document
        .getElementById("riskVisual")
        .appendChild(drawRiskMeter(out.risk_probability));

      // delayed AI advice reveal
      setTimeout(() => {
        document.getElementById("aiAdviceLoading").style.display = "none";
        const adviceDiv = document.getElementById("aiAdvice");
        adviceDiv.style.display = "block";
        adviceDiv.innerHTML = `
          <p style="font-weight:500">
            ${out.advice}
          </p>
        `;
      }, 2300);

    }, 1200);

  } catch (err) {
    loadingState.classList.add("hidden");
    resultState.classList.remove("hidden");
    resultState.innerHTML =
      `<p style="color:red">Error connecting to analysis engine.</p>`;
  }
});
