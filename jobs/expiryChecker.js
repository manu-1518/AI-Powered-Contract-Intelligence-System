const db=require("../db");
const { sendMail } = require("../services/notificationService");

const checkExpiries=() => {
    const query=`
    select c.name as company_name, c.email, ct.contract_id, ct.end_date, ct.value
    from contracts ct
    join companies c on ct.company_id=c.company_id`;

    db.query(query, async(errorMonitor,results)=>{
        if(errorMonitor) throw errorMonitor;

        const today=new Date();

        for(const row of results){
            const endDate=new Date(row.end_date);
            const daysLeft=Math.ceil((endDate-today)/(1000*60*60*24));

            if ([30, 15, 7].includes(daysLeft)) {
                await sendMail({
                    email: row.email,
                    companyName: row.company_name,
                    daysLeft,
                    contractId: row.contract_id,
                    contractValue: row.value
                });
            }
        }
    });
};

module.exports=checkExpiries;