const express = require("express");
const userAuth = require("../controllers/userAuth");
const creatEvent = require("../controllers/creatEvent");
const getAllEvents = require("../controllers/getmyEvents");
const router = express.Router();

router.post("/storeToken", userAuth)
router.post("/creatEvent", creatEvent)
router.get("/getAllEvents", getAllEvents)

module.exports = router;  