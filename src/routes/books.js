import express from 'express';
import authenticate from "../middlewares/authenticate";
import BookModel from "../Models/BookModel";
import BookToStudentModel from "../Models/BookToStudentModel";
import commonValidations from "../validations/commonValidations";


let router = express.Router();

router.get('/',authenticate, (req,res)=>{
    const page = req.query.page?parseInt(req.query.page):1;
    const find = {};
    if(req.query.category){
        find.categories = req.query.category
    }
    if(req.query.language){
        find.language = req.query.language
    }
    if(req.query.keywords){
        if(!req.query.keywords_type || req.query.keywords_type=='Book Name'){
            find.name = new RegExp(req.query.keywords,"i");
        }else if(req.query.keywords_type=='Writer'){
            find.writer = new RegExp(req.query.keywords,"i");
        }else if(req.query.keywords_type=='Publisher'){
            find.publisher = new RegExp(req.query.keywords,"i");
        }else if(req.query.keywords_type=='Max Stock'){
            find.current_stock = { $lte:req.query.keywords};
        }else if(req.query.keywords_type=='Min Stock'){
            find.current_stock = { $gte:req.query.keywords};
        }
    }
    BookModel.paginate(find,{
        page: page,
        limit: 2,
        sort: {created_at: -1},
        populate: [{path:'language',select:'name'},'categories']
    }).then((books)=>{
        res.json({ books });
    });

});
router.get('/:id',authenticate, (req,res)=>{
    const BookModelQuery = BookModel.findOne({_id:req.params.id});
    if(req.query.populate){
        BookModelQuery.populate([{path:'language',select:'name'},'categories']);
    }
    BookModelQuery.then((book)=>{
        if(book === null){
            res.status(400).json({ error:'Book Not found' });
        }else{
            res.json({ book });
        }
    }).catch((errors)=>{
        res.status(400).json({ error:'Book Not found' });
    });

});
router.get('/:id/students',authenticate, (req,res)=>{
    const page = req.query.page?parseInt(req.query.page):1;
    const find = {book_id:req.params.id};
    BookToStudentModel.paginate(find,{
        sort: {created_at: -1},
        page: page,
        limit: 2,
        populate: ['student_id']
    }).then((studentList)=>{
        res.json({ studentList });
    });

});

router.delete('/',authenticate, (req,res)=>{
    const { _id } = req.body;
    const update = BookModel.findOneAndDelete({_id:_id}).then(()=>{
        BookToStudentModel.remove({book_id:_id}).exec();
        res.json({
            success: true
        })
    });

});
router.delete('/students',authenticate, (req,res)=>{
    const {  _id } = req.body;
    BookToStudentModel.removeBook({_id:_id}).then(()=>{
        res.json({
            success: true
        })
    });
});
router.put('/',authenticate, (req,res)=>{
    const { errors, isValid } = commonValidations(req.body,{
        name: 'required',
        writer: 'required',
        publisher: 'required',
        language: 'required',
        items: 'required',
        categories: 'required'
    },{
        categories: {
            required: 'Please, select an item'
        }
    });
    const { _id, name, writer, publisher, language, items, details, categories } = req.body;

    if(isValid){
        BookModel.findByIdAndUpdate(_id,{$set:{name, writer, publisher, language, items, details, categories}}, { new: true })
        .then((book)=>{
            if(book===null){
                res.status(401).json({ errors: { _flash: 'Book Not found. Maybe deleted by another user'}});
            }
            res.json({ book });
        });
    }else{
        res.status(400).json({ errors });
    }
});
router.post('/give',authenticate, (req,res)=>{
    const { errors, isValid } = commonValidations(req.body,{
        book_id: 'required',
        student_id: 'required'
    });
    const { book_id, student_id } = req.body;
    if(isValid){
        BookModel.findOne({_id:book_id}).then(book=>{
            if(book.current_stock<1){
                res.status(400).json({ errors:'Book  stockover!' });
            }else{
                const BookToStudent = new BookToStudentModel({ book_id, student_id, created_by:req.currentUser._id });
                BookToStudent.save().then((bookTo)=>{
                    BookToStudentModel.populate(bookTo, {path:"student_id"}).then(bookTo=>{
                        res.json({ bookTo, status:'success' });
                    });
                }).catch((errors)=>{
                    console.log('errors.message: ', errors.message);
                    res.status(400).json({ errors:'Try again!' });
                })
            }
        }).catch((errors)=>{
            res.status(400).json({ errors:'Try again!' });
        });
    }else{
        res.status(400).json({ errors: "Required data missing." });
    }
});
router.post('/',authenticate, (req,res)=>{
    const { errors, isValid } = commonValidations(req.body,{
        name: 'required',
        writer: 'required',
        publisher: 'required',
        language: 'required',
        items: 'required',
        categories: 'required'
    },{
        categories: {
            required: 'Please, select an item'
        }
    });
    const { name, writer, publisher, language, items, details, categories } = req.body;

    if(isValid){
        const Book = new BookModel({name, writer, publisher, language, items, details, categories});
        Book.save().then((book)=>{
            res.json({ book });
        })
    }else{
        res.status(400).json({ errors });
    }
});
export default router;