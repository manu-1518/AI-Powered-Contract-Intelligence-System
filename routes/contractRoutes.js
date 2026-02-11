const express = require("express");
const db = require("../db");
const { getContractsWithCompanies } = require("../services/fallbackData");

const router = express.Router();

router.post("/", (req, res) => {
  const { company_id, start_date, end_date, value } = req.body;
  db.query(
    "INSERT INTO contracts VALUES (NULL, ?, ?, ?, ?, 'Active')",
    [company_id, start_date, end_date, value],
    () => res.send("Contract added")
  );
});

router.get("/", (req, res) => {
  const query = `
    SELECT ct.contract_id, ct.company_id, ct.start_date, ct.end_date, ct.value, ct.status,
           c.name AS company_name, c.email
    FROM contracts ct
    JOIN companies c ON ct.company_id = c.company_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.json(getContractsWithCompanies());
    }

    res.json(results || []);
  });
});

const getRiskExplanation = (daysLeft) => {
  if (daysLeft < 0) {
    return "Contract is already expired; revenue and service continuity may be at risk.";
  }
  if (daysLeft <= 7) {
    return "Very limited time left to renew; high risk of lapse without immediate action.";
  }
  if (daysLeft <= 15) {
    return "Renewal window is closing; proactive outreach is recommended.";
  }
  if (daysLeft <= 30) {
    return "Early warning period; begin renewal planning to avoid last-minute risk.";
  }
  return "Low immediate expiry risk, but continue regular engagement.";
};

router.get("/monitor", (req, res) => {
  const query = `
    SELECT ct.contract_id, ct.company_id, ct.start_date, ct.end_date, ct.value, ct.status,
           c.name AS company_name, c.email
    FROM contracts ct
    JOIN companies c ON ct.company_id = c.company_id
  `;

  db.query(query, (err, results) => {
    const rows = err ? getContractsWithCompanies() : (results || []);

    const today = new Date();
    const summary = {
      total: 0,
      active: 0,
      expiring_30: 0,
      expiring_15: 0,
      expiring_7: 0,
      expired: 0
    };

    const contracts = rows.map((row) => {
      const endDate = row.end_date ? new Date(row.end_date) : null;
      const daysLeft = endDate
        ? Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
        : null;

      let status = "Active";
      let window = null;

      if (daysLeft === null) {
        status = "Unknown";
      } else if (daysLeft < 0) {
        status = "Expired";
      } else if (daysLeft <= 7) {
        status = "Expiring in 7 days";
        window = 7;
      } else if (daysLeft <= 15) {
        status = "Expiring in 15 days";
        window = 15;
      } else if (daysLeft <= 30) {
        status = "Expiring in 30 days";
        window = 30;
      }

      summary.total += 1;
      if (status === "Expired") summary.expired += 1;
      else if (status === "Expiring in 7 days") summary.expiring_7 += 1;
      else if (status === "Expiring in 15 days") summary.expiring_15 += 1;
      else if (status === "Expiring in 30 days") summary.expiring_30 += 1;
      else if (status === "Active") summary.active += 1;

      return {
        contract_id: row.contract_id,
        company_id: row.company_id,
        company_name: row.company_name,
        email: row.email,
        start_date: row.start_date,
        end_date: row.end_date,
        value: row.value,
        status,
        days_left: daysLeft,
        critical_window_days: window,
        risk_explanation: daysLeft === null
          ? "Expiry date is missing; unable to assess risk reliably."
          : getRiskExplanation(daysLeft)
      };
    });

    res.json({
      as_of: today.toISOString(),
      summary,
      contracts
    });
  });
});

module.exports = router;
