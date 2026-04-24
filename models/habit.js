const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    color: {
        type: String,
        require: true,
    },
    repeatMode: {
        type: String,
        default: "Daily",
        require: true,
    },
    reminder: {
        type: Boolean,
        default: true,
    },
    notificationId: {
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