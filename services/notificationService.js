const nodemailer=require("nodemailer");

const emailLogs = [];
const MAX_LOGS = 200;

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"yourmail@gmail.com",
        pass:"app_password"
    }
});

const buildExpiryMessage = ({ companyName, daysLeft, contractId, contractValue }) => {
    const safeName = companyName || "Client";
    const valueLine = contractValue ? `Contract value: $${Number(contractValue).toLocaleString()}.` : "";
    const idLine = contractId ? `Contract ID: ${contractId}.` : "";

    return {
        subject: "Contract Expiry Reminder",
        text: [
            `Hello ${safeName},`,
            "This is an automated reminder that your contract is approaching its expiration date.",
            `Days remaining: ${daysLeft}.`,
            idLine,
            valueLine,
            "If you wish to renew or have questions, please reply and we will coordinate next steps.",
            "Thank you."
        ].filter(Boolean).join("\n")
    };
};

const sendMail=(payload)=>{
    const { email, daysLeft } = payload || {};
    const message = buildExpiryMessage(payload || {});

    if (!email || daysLeft === undefined || daysLeft === null) {
        return Promise.resolve();
    }

    return transporter.sendMail({
        to: email,
        subject: message.subject,
        text: message.text
    }).then((info) => {
        emailLogs.unshift({
            id: Date.now(),
            to: email,
            subject: message.subject,
            companyName: payload.companyName || "",
            contractId: payload.contractId || null,
            daysLeft,
            sentAt: new Date().toISOString(),
            status: "sent",
            messageId: info?.messageId || null
        });
        if (emailLogs.length > MAX_LOGS) {
            emailLogs.length = MAX_LOGS;
        }
        return info;
    }).catch((error) => {
        emailLogs.unshift({
            id: Date.now(),
            to: email,
            subject: message.subject,
            companyName: payload.companyName || "",
            contractId: payload.contractId || null,
            daysLeft,
            sentAt: new Date().toISOString(),
            status: "failed",
            error: error?.message || "Unknown error"
        });
        if (emailLogs.length > MAX_LOGS) {
            emailLogs.length = MAX_LOGS;
        }
        throw error;
    });
};

const getEmailLogs = () => emailLogs;

module.exports={
    sendMail,
    getEmailLogs
};