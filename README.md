Here is your properly formatted, clean, copy-paste ready `README.md` content:

---

# AI-Powered Contract Intelligence System

AI-powered contract tracking system that monitors expiry timelines and predicts client retention risk using explainable business rules. Built with Node.js, MySQL, and React to enable proactive renewal planning and churn prevention.

---

## Features

* Contract monitoring (active / expiring / expired) with 30 / 15 / 7-day alerts
* Retention prediction with explainable, data-driven reasoning
* Automated expiry emails with in-app notification log
* Sample dataset seeding for quick demos

---

## Tech Stack

* Node.js + Express
* MySQL
* Vanilla HTML / CSS / JavaScript frontend

---

## Getting Started

### 1) Install Dependencies

```bash
cd backend
npm install
```

---

### 2) Configure Environment

Create a `.env` file inside the `backend/` directory:

```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=contract_tracker

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

### 3) Run the Server

```bash
npx nodemon server.js
```

Open in browser:

```
http://localhost:5000
```

---

## Seed Sample Data

Use the UI button **"Load Sample Data"**
or call:

```
POST /seed
```

---

## Key Endpoints

* `GET /` — UI and server status
* `GET /contracts/monitor` — expiry windows and risk notes
* `GET /predict/:companyId` — retention prediction
* `GET /emails` — notification log
* `POST /emails/test` — send a test email
* `POST /seed` — load sample dataset

---

## Notes

* If no database is available, the UI falls back to built-in sample data.
* Gmail requires an App Password for SMTP configuration.

---

