const db = require("../db");

const exec = (sql, params = []) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) return reject(err);
    resolve(results);
  });
});

const ensureTables = async () => {
  await exec(`
    CREATE TABLE IF NOT EXISTS companies (
      company_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      industry VARCHAR(100)
    )
  `);

  await exec(`
    CREATE TABLE IF NOT EXISTS contracts (
      contract_id INT AUTO_INCREMENT PRIMARY KEY,
      company_id INT NOT NULL,
      start_date DATE,
      end_date DATE,
      value DECIMAL(12,2),
      status VARCHAR(20)
    )
  `);

  await exec(`
    CREATE TABLE IF NOT EXISTS client_history (
      history_id INT AUTO_INCREMENT PRIMARY KEY,
      company_id INT NOT NULL,
      previous_renewals INT,
      support_tickets INT,
      contract_value DECIMAL(12,2),
      business_importance VARCHAR(20),
      last_review_date DATE
    )
  `);
};

const seedDatabase = async (force = false) => {
  await ensureTables();

  const summary = {
    companies_inserted: 0,
    contracts_inserted: 0,
    history_inserted: 0
  };

  const [companyCountRow] = await exec("SELECT COUNT(*) AS count FROM companies");
  if (force || (companyCountRow?.count ?? 0) === 0) {
    if (force) {
      await exec("DELETE FROM client_history");
      await exec("DELETE FROM contracts");
      await exec("DELETE FROM companies");
    }

    await exec(
      "INSERT INTO companies (name, email, industry) VALUES ?",
      [[
        ["Arclight Manufacturing", "ops@arclight.com", "Manufacturing"],
        ["Blue Harbor Health", "admin@blueharbor.com", "Healthcare"],
        ["NovaRetail Group", "contracts@novaretail.com", "Retail"],
        ["Orion Logistics", "renewals@orionlogistics.com", "Logistics"],
        ["Pinecrest Tech", "success@pinecrest.io", "Technology"],
        ["Crestview Finance", "finance@crestview.com", "Finance"],
        ["Lumen Energy", "renewals@lumenenergy.com", "Energy"],
        ["Skyline Education", "admin@skyline.edu", "Education"],
        ["Mariner Foods", "contracts@marinerfoods.com", "Food & Beverage"],
        ["Vertex Media", "partner@vertexmedia.com", "Media"]
      ]]
    );
    summary.companies_inserted = 10;
  }

  const [contractCountRow] = await exec("SELECT COUNT(*) AS count FROM contracts");
  if (force || (contractCountRow?.count ?? 0) === 0) {
    await exec(
      "INSERT INTO contracts (company_id, start_date, end_date, value, status) VALUES ?",
      [[
        [1, "2025-02-10", "2026-02-17", 78000, "Active"],
        [2, "2025-05-01", "2026-02-25", 42000, "Active"],
        [3, "2025-03-15", "2026-03-12", 26000, "Active"],
        [4, "2024-12-01", "2025-12-31", 91000, "Expired"],
        [5, "2025-06-20", "2026-04-30", 120000, "Active"],
        [6, "2025-08-01", "2026-02-20", 65000, "Active"],
        [7, "2025-01-05", "2026-02-10", 54000, "Active"],
        [8, "2025-09-15", "2026-03-01", 31000, "Active"],
        [9, "2025-04-01", "2026-02-11", 47000, "Active"],
        [10, "2025-07-01", "2026-02-05", 88000, "Active"]
      ]]
    );
    summary.contracts_inserted = 10;
  }

  const [historyCountRow] = await exec("SELECT COUNT(*) AS count FROM client_history");
  if (force || (historyCountRow?.count ?? 0) === 0) {
    await exec(
      "INSERT INTO client_history (company_id, previous_renewals, support_tickets, contract_value, business_importance, last_review_date) VALUES ?",
      [[
        [1, 4, 3, 78000, "high", "2025-11-20"],
        [2, 2, 9, 42000, "medium", "2025-10-05"],
        [3, 0, 18, 26000, "low", "2025-09-12"],
        [4, 1, 22, 91000, "high", "2025-08-30"],
        [5, 5, 2, 120000, "high", "2025-12-15"],
        [6, 3, 6, 65000, "medium", "2025-11-05"],
        [7, 1, 14, 54000, "medium", "2025-10-21"],
        [8, 0, 4, 31000, "low", "2025-09-30"],
        [9, 2, 8, 47000, "medium", "2025-11-11"],
        [10, 6, 2, 88000, "high", "2025-12-01"]
      ]]
    );
    summary.history_inserted = 10;
  }

  return summary;
};

module.exports = { seedDatabase };
