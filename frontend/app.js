const API_BASE = "";

const elements = {
  asOf: document.getElementById("as-of"),
  summaryTotal: document.getElementById("summary-total"),
  summaryActive: document.getElementById("summary-active"),
  summaryExpired: document.getElementById("summary-expired"),
  summary30: document.getElementById("summary-30"),
  summary15: document.getElementById("summary-15"),
  summary7: document.getElementById("summary-7"),
  contractsTable: document.getElementById("contracts-table"),
  companySelect: document.getElementById("company-select"),
  predictionOutput: document.getElementById("prediction-output"),
  emailLogTable: document.getElementById("email-log-table"),
  refreshAll: document.getElementById("refresh-all"),
  seedData: document.getElementById("seed-data"),
  seedStatus: document.getElementById("seed-status"),
  predictButton: document.getElementById("predict"),
  sendTestEmail: document.getElementById("send-test-email")
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
};

const fetchJson = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  if (!response.ok) {
    throw new Error("Request failed");
  }
  return response.json();
};

const renderSummary = (summary, asOf) => {
  elements.summaryTotal.textContent = summary.total ?? "—";
  elements.summaryActive.textContent = summary.active ?? "—";
  elements.summaryExpired.textContent = summary.expired ?? "—";
  elements.summary30.textContent = summary.expiring_30 ?? "—";
  elements.summary15.textContent = summary.expiring_15 ?? "—";
  elements.summary7.textContent = summary.expiring_7 ?? "—";

  if (asOf) {
    const date = new Date(asOf);
    elements.asOf.textContent = `As of ${date.toLocaleString()}`;
  }
};

const renderContracts = (contracts) => {
  if (!contracts || contracts.length === 0) {
    elements.contractsTable.innerHTML =
      "<tr><td colspan='5' class='placeholder'>No contracts available.</td></tr>";
    return;
  }

  elements.contractsTable.innerHTML = contracts
    .map((contract) => {
      return `
        <tr>
          <td>
            <strong>${contract.company_name || "Unknown"}</strong><br />
            <span class="muted">${contract.email || "—"}</span>
          </td>
          <td>${contract.status || "—"}</td>
          <td>${contract.days_left ?? "—"}</td>
          <td>${formatCurrency(contract.value)}</td>
          <td>${contract.risk_explanation || "—"}</td>
        </tr>
      `;
    })
    .join("");
};

const loadMonitor = async () => {
  try {
    const data = await fetchJson("/contracts/monitor");
    renderSummary(data.summary || {}, data.as_of);
    renderContracts(data.contracts || []);
  } catch (error) {
    elements.contractsTable.innerHTML =
      "<tr><td colspan='5' class='placeholder'>Unable to retrieve contract monitoring data.</td></tr>";
  }
};

const loadCompanies = async () => {
  try {
    const companies = await fetchJson("/companies");
    elements.companySelect.innerHTML = companies
      .map((company) => {
        return `<option value='${company.company_id}'>${company.name}</option>`;
      })
      .join("");

    if (!companies.length) {
      elements.companySelect.innerHTML = "<option value=''>No companies found</option>";
    }
  } catch (error) {
    elements.companySelect.innerHTML = "<option value=''>Unable to load companies</option>";
  }
};

const renderPrediction = (prediction, recommendations) => {
  if (!prediction) {
    elements.predictionOutput.innerHTML =
      "<div class='placeholder'>No prediction available.</div>";
    return;
  }

  const classification = prediction.classification || "Insufficient Data";
  const confidence = prediction.confidence || "Low";

  const pillClass =
    classification === "High Risk of Churn"
      ? "low"
      : classification === "Likely to Stay"
      ? "high"
      : "neutral";

  elements.predictionOutput.innerHTML = `
    <div class='prediction-card'>
      <div>
        <span class='pill ${pillClass}'>${classification}</span>
        <span class='pill neutral'>Confidence: ${confidence}</span>
      </div>
      <div>
        <strong>Explanation</strong>
        <ul class='list'>
          ${(prediction.explanation || ["No explanation available."])
            .map((item) => `<li>${item}</li>`)
            .join("")}
        </ul>
      </div>
      <div>
        <strong>Recommended Next Steps</strong>
        <ul class='list'>
          ${(recommendations || ["No recommendations available."])
            .map((item) => `<li>${item}</li>`)
            .join("")}
        </ul>
      </div>
    </div>
  `;
};

const loadPrediction = async () => {
  const companyId = elements.companySelect.value;
  if (!companyId) {
    renderPrediction({
      classification: "Insufficient Data",
      confidence: "Low",
      explanation: ["Select a client to view retention insights."]
    });
    return;
  }

  try {
    const data = await fetchJson(`/predict/${companyId}`);
    renderPrediction(data.prediction, data.recommendations);
  } catch (error) {
    renderPrediction({
      classification: "Insufficient Data",
      confidence: "Low",
      explanation: ["Unable to retrieve prediction at this time."]
    });
  }
};

const renderEmailLogs = (logs) => {
  if (!elements.emailLogTable) return;
  if (!logs || logs.length === 0) {
    elements.emailLogTable.innerHTML =
      "<tr><td colspan='5' class='placeholder'>No email activity yet.</td></tr>";
    return;
  }

  elements.emailLogTable.innerHTML = logs
    .map((log) => {
      const sentAt = log.sentAt ? new Date(log.sentAt).toLocaleString() : "—";
      return `
        <tr>
          <td>${log.to || "—"}</td>
          <td>${log.companyName || "—"}</td>
          <td>${log.daysLeft ?? "—"}</td>
          <td>${log.status || "—"}</td>
          <td>${sentAt}</td>
        </tr>
      `;
    })
    .join("");
};

const loadEmailLogs = async () => {
  if (!elements.emailLogTable) return;
  try {
    const logs = await fetchJson("/emails/logs");
    renderEmailLogs(logs);
  } catch (error) {
    elements.emailLogTable.innerHTML =
      "<tr><td colspan='5' class='placeholder'>Unable to load email logs.</td></tr>";
  }
};

const seedSampleData = async () => {
  elements.seedStatus.textContent = "Loading sample data...";
  try {
    const result = await fetchJson("/seed", { method: "POST" });
    elements.seedStatus.textContent =
      "Sample data is ready. Refreshing insights...";
    await loadCompanies();
    await loadMonitor();
    await loadPrediction();
    await loadEmailLogs();
    elements.seedStatus.textContent =
      "Sample data loaded. Insights are up to date.";
  } catch (error) {
    elements.seedStatus.textContent =
      "Unable to load sample data. Please try again.";
  }
};

const init = async () => {
  await loadCompanies();
  await loadMonitor();
  await loadEmailLogs();
};

elements.refreshAll.addEventListener("click", async () => {
  await loadCompanies();
  await loadMonitor();
  await loadPrediction();
  await loadEmailLogs();
});

if (elements.sendTestEmail) {
  elements.sendTestEmail.addEventListener("click", async () => {
    elements.sendTestEmail.disabled = true;
    elements.sendTestEmail.textContent = "Sending...";
    try {
      await fetchJson("/emails/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      await loadEmailLogs();
      elements.sendTestEmail.textContent = "Send Test Email";
    } catch (error) {
      elements.sendTestEmail.textContent = "Send Test Email";
    } finally {
      elements.sendTestEmail.disabled = false;
    }
  });
}

elements.predictButton.addEventListener("click", loadPrediction);

if (elements.seedData) {
  elements.seedData.addEventListener("click", seedSampleData);
}

init();
