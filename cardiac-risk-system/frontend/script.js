/* =========================
   THEME SWITCH
========================= */
function setTheme(theme) {
  document.body.classList.remove("theme-light", "theme-dark", "theme-contrast", "theme-obsidian");
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('pulseai-theme', theme);
  
  // Update progress steps when theme changes
  updateProgressStep(1);
}

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('pulseai-theme') || 'dark';
  setTheme(savedTheme);
});

/* =========================
   STATE ELEMENTS
========================= */
const idleState = document.getElementById("idleState");
const loadingState = document.getElementById("loadingState");
const resultState = document.getElementById("resultState");

/* =========================
   PROGRESS STEP MANAGEMENT
========================= */
function updateProgressStep(step) {
  const steps = document.querySelectorAll('.progress-steps .step');
  steps.forEach((el, index) => {
    if (index < step) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

/* =========================
   DRAW CIRCULAR RISK METER
========================= */
function drawRiskMeter(percent) {
  const canvas = document.createElement("canvas");
  canvas.width = 240;
  canvas.height = 240;
  
  const ctx = canvas.getContext("2d");
  const center = 120;
  const radius = 85;
  const lineWidth = 16;
  
  // Background circle
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border').trim();
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Progress circle
  const angle = (percent / 100) * Math.PI * 2;
  ctx.lineCap = 'round';
  
  // Determine color based on risk level
  if (percent < 30) {
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--success').trim();
  } else if (percent < 60) {
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--warning').trim();
  } else {
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--danger').trim();
  }
  
  ctx.beginPath();
  ctx.arc(center, center, radius, -Math.PI / 2, angle - Math.PI / 2);
  ctx.stroke();
  
  // Center text
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text').trim();
  ctx.font = "700 36px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${percent}%`, center, center);
  
  return canvas;
}

/* =========================
   FORM SUBMIT
========================= */
document.getElementById("healthForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Update progress
  updateProgressStep(2);
  
  // Transition states
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
    
    // Simulate processing time
    setTimeout(() => {
      updateProgressStep(3);
      loadingState.classList.add("hidden");
      resultState.classList.remove("hidden");
      
      // Determine risk level styling
      const riskClass = 
        out.risk_probability < 30 ? 'low-risk' :
        out.risk_probability < 60 ? 'medium-risk' : 'high-risk';
      
      resultState.innerHTML = `
        <h2>Assessment Complete</h2>
        
        <div class="result-grid">
          <div class="result-card">
            <div class="result-label">Body Mass Index</div>
            <div class="result-value">${out.bmi}</div>
          </div>
          
          <div class="result-card ${riskClass}">
            <div class="result-label">Risk Classification</div>
            <div class="result-value">${out.risk_level}</div>
          </div>
          
          <div class="result-card">
            <div class="result-label">Cardiac Risk Score</div>
            <div class="result-value">${out.risk_probability}%</div>
          </div>
        </div>
        
        <div class="risk-visual" id="riskVisual"></div>
        
        <div class="result-interpretation">
          <h3>Clinical Interpretation</h3>
          <p>Based on the provided metrics, the AI model has calculated a ${out.risk_level.toLowerCase()} cardiac risk profile with a ${out.risk_probability}% probability score. This assessment considers multiple cardiovascular factors including blood pressure, cholesterol levels, and clinical indicators.</p>
        </div>
        
        <div id="aiAdviceLoading" style="margin-top: var(--space-xl); text-align: center;">
          <div class="ai-loader"></div>
          <p style="color: var(--text-muted); font-size: var(--font-sm); margin-top: var(--space-md);">
            Generating personalized recommendations
          </p>
        </div>
        
        <div id="aiAdvice" class="ai-advice" style="display: none;"></div>
        
        <div class="result-footer">
          <p style="font-size: var(--font-xs); color: var(--text-muted); text-align: center; margin-top: var(--space-lg);">
            Assessment generated using AI-assisted clinical risk models. Results are for informational purposes only.
          </p>
        </div>
      `;
      
      // Add result card styles dynamically
      const style = document.createElement('style');
      style.textContent = `
        .result-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }
        
        .result-card {
          padding: var(--space-lg);
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          text-align: center;
          transition: all var(--transition-base);
        }
        
        .result-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .result-label {
          font-size: var(--font-xs);
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--space-sm);
        }
        
        .result-value {
          font-size: var(--font-xl);
          font-weight: 700;
          color: var(--text);
        }
        
        .result-card.low-risk {
          background: rgba(16, 185, 129, 0.1);
          border-color: var(--success);
        }
        
        .result-card.low-risk .result-value {
          color: var(--success);
        }
        
        .result-card.medium-risk {
          background: rgba(245, 158, 11, 0.1);
          border-color: var(--warning);
        }
        
        .result-card.medium-risk .result-value {
          color: var(--warning);
        }
        
        .result-card.high-risk {
          background: rgba(239, 68, 68, 0.1);
          border-color: var(--danger);
        }
        
        .result-card.high-risk .result-value {
          color: var(--danger);
        }
        
        .result-interpretation {
          padding: var(--space-lg);
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          margin-top: var(--space-xl);
          text-align: left;
        }
        
        .result-interpretation h3 {
          font-size: var(--font-md);
          font-weight: 600;
          margin-bottom: var(--space-sm);
          color: var(--text);
        }
        
        .result-interpretation p {
          font-size: var(--font-sm);
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0;
          padding: 0;
          background: transparent;
          border: none;
          display: block;
        }
      `;
      document.head.appendChild(style);
      
      // Add risk meter visualization
      document
        .getElementById("riskVisual")
        .appendChild(drawRiskMeter(out.risk_probability));
      
      // Delayed AI advice reveal with animation
      setTimeout(() => {
        document.getElementById("aiAdviceLoading").style.display = "none";
        const adviceDiv = document.getElementById("aiAdvice");
        adviceDiv.style.display = "block";
        adviceDiv.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: var(--space-md);">
            <div style="flex-shrink: 0; font-size: var(--font-xl);">🤖</div>
            <div>
              <h4 style="font-size: var(--font-base); font-weight: 600; margin-bottom: var(--space-sm); color: var(--text);">
                AI-Generated Recommendations
              </h4>
              <p style="margin: 0; line-height: 1.7; color: var(--text-secondary);">
                ${out.advice}
              </p>
            </div>
          </div>
        `;
      }, 2400);
      
    }, 1500);
    
  } catch (err) {
    updateProgressStep(3);
    loadingState.classList.add("hidden");
    resultState.classList.remove("hidden");
    resultState.innerHTML = `
      <div style="padding: var(--space-xl); text-align: center;">
        <div style="font-size: 48px; margin-bottom: var(--space-md);">⚠️</div>
        <h3 style="color: var(--danger); margin-bottom: var(--space-sm);">Connection Error</h3>
        <p style="color: var(--text-secondary);">
          Unable to connect to the analysis engine. Please ensure the backend server is running.
        </p>
      </div>
    `;
  }
});
