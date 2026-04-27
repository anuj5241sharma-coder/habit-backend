const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: "#38BDF8",
    },
    repeatMode: {
        type: String,
        default: "Daily",
        required: true,
    },
    reminder: {
        type: Boolean,
        default: true,
    },
    days: {
        type: Array,
        default: [],
    },
    notificationId: {
        type: String,
        default: null,
    },
    deviceId: {
        type: String,
        default: null,
    },
    completed: {
        type: Object,
        default: {},
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    archived: {
        type: Boolean,
        default: false
    },
    markedDates: {
        type: Object,
        default: {},
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});



const Habit = mongoose.model("Habit", habitSchema);

module.exports = Habit
