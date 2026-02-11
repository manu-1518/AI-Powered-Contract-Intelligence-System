const normalizeNumber = (value) => {
    if (value === undefined || value === null || value === "") return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
};

const normalizeImportance = (value) => {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value === "string") return value.trim().toLowerCase();
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
};

const predictRetention = (history = {}) => {
    const dataGaps = [];

    const previousRenewals = normalizeNumber(
        history.previous_renewals ?? history.previous_renewala ?? history.renewals
    );
    const supportTickets = normalizeNumber(
        history.support_tickets ?? history.support_interactions
    );
    const contractValue = normalizeNumber(
        history.contract_value ?? history.contractt_value ?? history.value
    );
    const businessImportance = normalizeImportance(
        history.business_importance ?? history.importance
    );

    if (previousRenewals === null) dataGaps.push("Previous renewals");
    if (supportTickets === null) dataGaps.push("Support interaction volume");
    if (contractValue === null) dataGaps.push("Contract value");
    if (businessImportance === null) dataGaps.push("Business importance");

    const availableSignals = [previousRenewals, supportTickets, contractValue]
        .filter((value) => value !== null).length;

    if (availableSignals < 2) {
        return {
            classification: "Insufficient Data",
            score: null,
            confidence: "Low",
            explanation: [
                "Prediction is based on limited information.",
                dataGaps.length
                    ? `Missing: ${dataGaps.join(", ")}.`
                    : "Key client history fields are missing."
            ],
            data_gaps: dataGaps
        };
    }

    let score = 0;
    const explanation = [];

    if (previousRenewals !== null) {
        if (previousRenewals >= 3) {
            score += 40;
            explanation.push("Multiple past renewals indicate strong renewal behavior.");
        } else if (previousRenewals >= 1) {
            score += 25;
            explanation.push("Some renewal history suggests a stable relationship.");
        } else {
            score += 5;
            explanation.push("No prior renewals on record adds uncertainty.");
        }
    }

    if (supportTickets !== null) {
        if (supportTickets <= 5) {
            score += 30;
            explanation.push("Low support interactions suggest fewer operational issues.");
        } else if (supportTickets <= 15) {
            score += 15;
            explanation.push("Moderate support interactions indicate manageable issues.");
        } else {
            explanation.push("High support interactions may signal friction or risk.");
        }
    }

    if (contractValue !== null) {
        if (contractValue >= 50000) {
            score += 30;
            explanation.push("High contract value signals strategic importance.");
        } else if (contractValue >= 20000) {
            score += 15;
            explanation.push("Mid-tier contract value suggests moderate importance.");
        } else {
            score += 5;
            explanation.push("Lower contract value can reduce renewal urgency.");
        }
    }

    if (businessImportance !== null) {
        if (typeof businessImportance === "string") {
            if (businessImportance === "high") {
                score += 15;
                explanation.push("Business marked as high importance for strategic value.");
            } else if (businessImportance === "medium") {
                score += 8;
                explanation.push("Business importance is moderate.");
            } else if (businessImportance === "low") {
                score += 3;
                explanation.push("Business importance is low.");
            }
        } else if (typeof businessImportance === "number") {
            if (businessImportance >= 8) {
                score += 15;
                explanation.push("High importance score supports retention likelihood.");
            } else if (businessImportance >= 5) {
                score += 8;
                explanation.push("Moderate importance score adds some retention support.");
            } else {
                score += 3;
                explanation.push("Lower importance score reduces retention confidence.");
            }
        }
    }

    if (score > 100) score = 100;

    const classification = score >= 60 ? "Likely to Stay" : "High Risk of Churn";
    const confidence = dataGaps.length === 0 ? "High" : "Medium";

    if (dataGaps.length) {
        explanation.push(`Prediction uses limited inputs. Missing: ${dataGaps.join(", ")}.`);
    }

    return {
        classification,
        score,
        confidence,
        explanation,
        data_gaps: dataGaps
    };
};

module.exports = predictRetention;