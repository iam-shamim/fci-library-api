import Book from './BookModel';
var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
const BookToStudentModelSchema = new Schema({
    book_id: { required: true, type: Schema.Types.ObjectId, ref: 'books' },
    student_id: { required: true, type: Schema.Types.ObjectId, ref: 'students' },
    created_by: { required: true, type: Schema.Types.ObjectId, ref: 'users' },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: Date.now
    }
});

BookToStudentModelSchema.post('save', function(doc) {
    const book_id = doc.book_id;
    Book.update({_id:book_id},{
        $inc: { current_stock: -1 }
    }).exec();
});
BookToStudentModelSchema.plugin(paginate);
const BookToStudentModel = mongoose.model('books_to_students', BookToStudentModelSchema);
module.exports = BookToStudentModel;
module.exports.removeBook = function (find) {
    return BookToStudentModel.findOneAndRemove(find).then((doc)=>{
        const book_id = doc.book_id;
        Book.update({_id:book_id},{
            $inc: { current_stock: 1 }
        }).exec();
    });
};