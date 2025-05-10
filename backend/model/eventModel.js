const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
    userId: { type:mongoose.Schema.Types.ObjectId,
        ref:"User" },
    summery: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    eventId: { type: String }
})

const events = mongoose.model("Event", eventSchema);

module.exports = events;