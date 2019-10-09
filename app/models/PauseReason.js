const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let pauseReasonSchema = new Schema({
    email: { type: String, lowercase: true },
    userId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    reason: { type: String, default: "" }
});

const PauseReason = mongoose.model('PauseReason', pauseReasonSchema);

module.exports = PauseReason;