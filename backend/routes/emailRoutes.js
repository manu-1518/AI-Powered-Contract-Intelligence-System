const express = require("express");
const { getEmailLogs, sendMail } = require("../services/notificationService");

const router = express.Router();

router.get("/logs", (req, res) => {
  res.json(getEmailLogs());
});

router.post("/test", async (req, res) => {
  const payload = {
    email: req.body?.email || "test@example.com",
    companyName: req.body?.companyName || "Sample Client",
    daysLeft: req.body?.daysLeft ?? 7,
    contractId: req.body?.contractId || "TEST-001",
    contractValue: req.body?.contractValue || 50000
  };

  try {
    await sendMail(payload);
    res.json({ status: "ok", message: "Test email sent.", payload });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Unable to send test email.",
      details: error?.message || "Unknown error"
    });
  }
});

module.exports = router;
