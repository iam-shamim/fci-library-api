import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var shiftSchema = new Schema({
    name: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});
const ShiftModel = mongoose.model('shift', shiftSchema);

module.exports = ShiftModel;