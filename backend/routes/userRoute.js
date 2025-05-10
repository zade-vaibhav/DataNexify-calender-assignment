const express = require("express");
const userAuth = require("../controllers/userAuth");
const creatEvent = require("../controllers/creatEvent");
const getAllEvents = require("../controllers/getmyEvents");
const editEvent = require("../controllers/updateEvent");
const deleteEvent = require("../controllers/deleteEvent");
const router = express.Router();

router.post("/storeToken", userAuth)
router.post("/creatEvent", creatEvent)
router.get("/getAllEvents", getAllEvents)
router.patch("/event/update/:id", editEvent)
router.delete("/event/delete/:id", deleteEvent)

module.exports = router;  