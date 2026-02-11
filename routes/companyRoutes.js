const express=require("express");
const db=require("../db");
const { companies } = require("../services/fallbackData");

const router=express.Router();

router.get("/", (req, res) => {
    db.query(
        "SELECT company_id, name, email, industry FROM companies",
        (err, results) => {
            if (err) {
                return res.json(companies);
            }
            res.json(results || []);
        }
    );
});

router.post("/",(req,res)=>{

    const {name,email,industry}=req.body;
    db.query(
        "insert into companies values (NULL,?,?,?)",
        [name,email,industry],
        ()=>res.send("Company added")
    );
})

module.exports=router;