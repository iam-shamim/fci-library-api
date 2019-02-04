import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var CategorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});
const CategoryModel = mongoose.model('categories', CategorySchema);

module.exports = CategoryModel;