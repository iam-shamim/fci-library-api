import mongoose from 'mongoose';
var paginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var StudentSchema = new Schema({
    name: String,
    father_name: String,
    department: { type: Schema.Types.ObjectId, ref: 'department' },
    shift: { type: Schema.Types.ObjectId, ref: 'shift' },
    year: { type: Schema.Types.ObjectId, ref: 'years' },
    roll: Number,
    registration: Number,
    gender: Number,
    created_at: {
        type: Date,
        default: Date.now
    }
});
StudentSchema.plugin(paginate);
const StudentModel = mongoose.model('students', StudentSchema);
module.exports = StudentModel;