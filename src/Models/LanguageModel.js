import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var LanguageSchema = new Schema({
    name: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});
const LanguageModel = mongoose.model('language', LanguageSchema);

module.exports = LanguageModel;