const express = require("express");
const db = require("../db");
const predictRetention = require("../services/retentionModel");
const { getHistoryByCompanyId } = require("../services/fallbackData");

const router = express.Router();

router.get("/:companyId", (req, res) => {
  db.query(
    "SELECT * FROM client_history WHERE company_id = ?",
    [req.params.companyId],
    (err, results) => {
      const historyRecord = (!err && results && results.length > 0)
        ? results[0]
        : getHistoryByCompanyId(req.params.companyId);

      if (!historyRecord) {
        return res.json({
          prediction: {
            classification: "Insufficient Data",
            score: null,
            confidence: "Low",
            explanation: [
              "No client history found for this company.",
              "Prediction is based on limited information."
            ],
            data_gaps: ["Client history"]
          },
          recommendations: [
            "Collect recent renewal history and support activity.",
            "Confirm contract value and business importance."
          ]
        });
      }

      const prediction = predictRetention(historyRecord);
      const recommendations = [];

      if (prediction.classification === "High Risk of Churn") {
        recommendations.push(
          "Initiate early renewal discussions to reduce lapse risk.",
          "Address open support issues and confirm stakeholder satisfaction.",
          "Strengthen executive relationships and clarify renewal value."
        );
      } else if (prediction.classification === "Likely to Stay") {
        recommendations.push(
          "Schedule a renewal planning touchpoint well ahead of expiry.",
          "Reinforce delivered value and explore expansion opportunities.",
          "Maintain steady relationship cadence to prevent surprises."
        );
      } else {
        recommendations.push(
          "Gather missing client data before forming a retention plan.",
          "Validate support volume and renewal history with account owners."
        );
      }

      res.json({ prediction, recommendations });
    }
  );
});

module.exports = router;
