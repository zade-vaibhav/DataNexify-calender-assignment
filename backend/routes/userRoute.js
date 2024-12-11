const express =require("express");
const userAuth = require("../controllers/userAuth");
const creatEvent = require("../controllers/creatEvent");
const router =express.Router();

router.post("/storeToken",userAuth)
router.post("/creatEvent",creatEvent)

module.exports =router;  