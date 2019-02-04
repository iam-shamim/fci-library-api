import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var DepartmentSchema = new Schema({
    name: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});
const DepartmentModel = mongoose.model('department', DepartmentSchema);

module.exports = DepartmentModel;