var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');

var Schema = mongoose.Schema;
const BookSchema = new Schema({
    name: {type: String, required: true},
    writer: {type: String, required: true},
    publisher: {type: String, required: true},
    language: { type: Schema.Types.ObjectId, ref: 'language' },
    items: {type: Number, required: true},
    details: {type: String, default: ''},
    categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
    current_stock: Number,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: Date.now
    }
});
BookSchema.pre('save', function(next) {
    this.set('current_stock',this.get('items'));
    next();
});
BookSchema.plugin(paginate);
const BooksModel = mongoose.model('books', BookSchema);
module.exports = BooksModel;