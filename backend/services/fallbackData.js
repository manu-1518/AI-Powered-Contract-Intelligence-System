const companies = [
  { company_id: 1, name: "Arclight Manufacturing", email: "ops@arclight.com", industry: "Manufacturing" },
  { company_id: 2, name: "Blue Harbor Health", email: "admin@blueharbor.com", industry: "Healthcare" },
  { company_id: 3, name: "NovaRetail Group", email: "contracts@novaretail.com", industry: "Retail" },
  { company_id: 4, name: "Orion Logistics", email: "renewals@orionlogistics.com", industry: "Logistics" },
  { company_id: 5, name: "Pinecrest Tech", email: "success@pinecrest.io", industry: "Technology" },
  { company_id: 6, name: "Crestview Finance", email: "finance@crestview.com", industry: "Finance" },
  { company_id: 7, name: "Lumen Energy", email: "renewals@lumenenergy.com", industry: "Energy" },
  { company_id: 8, name: "Skyline Education", email: "admin@skyline.edu", industry: "Education" },
  { company_id: 9, name: "Mariner Foods", email: "contracts@marinerfoods.com", industry: "Food & Beverage" },
  { company_id: 10, name: "Vertex Media", email: "partner@vertexmedia.com", industry: "Media" }
];

const contracts = [
  { contract_id: 1, company_id: 1, start_date: "2025-02-10", end_date: "2026-02-17", value: 78000, status: "Active" },
  { contract_id: 2, company_id: 2, start_date: "2025-05-01", end_date: "2026-02-25", value: 42000, status: "Active" },
  { contract_id: 3, company_id: 3, start_date: "2025-03-15", end_date: "2026-03-12", value: 26000, status: "Active" },
  { contract_id: 4, company_id: 4, start_date: "2024-12-01", end_date: "2025-12-31", value: 91000, status: "Expired" },
  { contract_id: 5, company_id: 5, start_date: "2025-06-20", end_date: "2026-04-30", value: 120000, status: "Active" },
  { contract_id: 6, company_id: 6, start_date: "2025-08-01", end_date: "2026-02-20", value: 65000, status: "Active" },
  { contract_id: 7, company_id: 7, start_date: "2025-01-05", end_date: "2026-02-10", value: 54000, status: "Active" },
  { contract_id: 8, company_id: 8, start_date: "2025-09-15", end_date: "2026-03-01", value: 31000, status: "Active" },
  { contract_id: 9, company_id: 9, start_date: "2025-04-01", end_date: "2026-02-11", value: 47000, status: "Active" },
  { contract_id: 10, company_id: 10, start_date: "2025-07-01", end_date: "2026-02-05", value: 88000, status: "Active" }
];

const clientHistory = [
  { history_id: 1, company_id: 1, previous_renewals: 4, support_tickets: 3, contract_value: 78000, business_importance: "high", last_review_date: "2025-11-20" },
  { history_id: 2, company_id: 2, previous_renewals: 2, support_tickets: 9, contract_value: 42000, business_importance: "medium", last_review_date: "2025-10-05" },
  { history_id: 3, company_id: 3, previous_renewals: 0, support_tickets: 18, contract_value: 26000, business_importance: "low", last_review_date: "2025-09-12" },
  { history_id: 4, company_id: 4, previous_renewals: 1, support_tickets: 22, contract_value: 91000, business_importance: "high", last_review_date: "2025-08-30" },
  { history_id: 5, company_id: 5, previous_renewals: 5, support_tickets: 2, contract_value: 120000, business_importance: "high", last_review_date: "2025-12-15" },
  { history_id: 6, company_id: 6, previous_renewals: 3, support_tickets: 6, contract_value: 65000, business_importance: "medium", last_review_date: "2025-11-05" },
  { history_id: 7, company_id: 7, previous_renewals: 1, support_tickets: 14, contract_value: 54000, business_importance: "medium", last_review_date: "2025-10-21" },
  { history_id: 8, company_id: 8, previous_renewals: 0, support_tickets: 4, contract_value: 31000, business_importance: "low", last_review_date: "2025-09-30" },
  { history_id: 9, company_id: 9, previous_renewals: 2, support_tickets: 8, contract_value: 47000, business_importance: "medium", last_review_date: "2025-11-11" },
  { history_id: 10, company_id: 10, previous_renewals: 6, support_tickets: 2, contract_value: 88000, business_importance: "high", last_review_date: "2025-12-01" }
];

const getCompanyById = (id) => companies.find((company) => String(company.company_id) === String(id));
const getHistoryByCompanyId = (id) => clientHistory.find((history) => String(history.company_id) === String(id));
const getContractsWithCompanies = () =>
  contracts.map((contract) => ({
    ...contract,
    company_name: getCompanyById(contract.company_id)?.name ?? "Unknown",
    email: getCompanyById(contract.company_id)?.email ?? "—"
  }));

module.exports = {
  companies,
  contracts,
  clientHistory,
  getCompanyById,
  getHistoryByCompanyId,
  getContractsWithCompanies
};
