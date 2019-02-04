import express from 'express';
import authenticate from "../middlewares/authenticate";
import StudentModel from "../Models/StudentModel";
import commonValidations from "../validations/commonValidations";
import BookModel from "../Models/BookModel";
import BookToStudentModel from "../Models/BookToStudentModel";
import ShiftModel from "../Models/ShiftModel";


let router = express.Router();

router.get('/',authenticate, (req,res)=>{
    const page = req.query.page?parseInt(req.query.page):1;
    const find = {};
    if(req.query.category){
        find.categories = req.query.category
    }
    StudentModel.paginate(find,{
        page: page,
        limit: 2,
        populate: ['department','shift','year']
    }).then((students)=>{
        res.json({ students });
    });

});
router.get('/:id',authenticate, (req,res)=>{
    const StudentQuery = StudentModel.findOne({_id:req.params.id});
    if(req.query.populate){
        StudentQuery.populate(['department','shift','year']);
    }
    StudentQuery.then((student)=>{
        if(student === null){
            res.status(400).json({ error:'Student Not found' });
        }else{
            res.json({ student });
        }
    }).catch((errors)=>{
        res.status(400).json({ error:'Student Not found' });
    });

});
router.get('/:id/books',authenticate, (req,res)=>{
    const page = req.query.page?parseInt(req.query.page):1;
    const find = {student_id:req.params.id};
    BookToStudentModel.paginate(find,{
        sort: {created_at: -1},
        page: page,
        limit: 2,
        populate: ['book_id']
    }).then((bookList)=>{
        res.json({ bookList });
    });

});
async function findStudentWith(find){
    let student = null;
    try {
         student = await StudentModel.findOne(find);
         return student
    }catch (e) {
        return student
    }

}
router.get('/:reg_id/reg',authenticate, async (req,res)=>{
    const book_id = req.query.book_id;
    const find = {};
    find.registration = req.params.reg_id;
    const student = await findStudentWith(find);
    if(student === null){
        res.json({student: null})
    }else{
        BookToStudentModel.findOne({book_id:book_id,student_id:student._id}).then((checkExists)=>{
            res.json({student,checkExists})
        }).catch((e)=>{
            res.json({student,checkExists:null})
        });
    }
});
router.delete('/',authenticate, (req,res)=>{
    const {  _id } = req.body;
    const update = StudentModel.findOneAndDelete({_id:_id}).then(()=>{
        res.json({
            success: true
        })
    });
});
router.delete('/books',authenticate, (req,res)=>{
    const {  _id } = req.body;
    BookToStudentModel.removeBook({_id:_id}).then(()=>{
        res.json({
            success: true
        })
    });
});
router.put('/',authenticate, (req,res)=>{
    const { _id, name,father_name, department, shift, year, roll, registration, gender } = req.body;
    const { errors, isValid } = commonValidations(req.body,{
        name: 'required',
        father_name: 'required',
        department: 'required',
        shift: 'required',
        year: 'required',
        roll: 'required',
        registration: 'required'
    });

    if(isValid){
        const update = StudentModel.findOneAndUpdate({_id:_id},{$set:{
                name,
                father_name,
                department,
                shift,
                year,
                roll,
                registration,
                gender
            }},{ new:true }).then((student)=>{
            if(student===null){
                res.status(401).json({ errors: { _flash: 'Student Not found. Maybe deleted by another user'}});
            }
            res.json({ student });
        });
    }else{
        res.status(400).json({ errors });
    }
});
router.post('/',authenticate, (req,res)=>{
    const { name,father_name, department, shift, year, roll, registration, gender } = req.body;
    const { errors, isValid } = commonValidations(req.body,{
        name: 'required',
        father_name: 'required',
        department: 'required',
        shift: 'required',
        year: 'required',
        roll: 'required',
        registration: 'required'
    });

    if(isValid){
        const Student = new StudentModel({
            name,
            father_name,
            department,
            shift,
            year,
            roll,
            registration,
            gender
        });
        Student.save().then((student)=>{
            res.json({ student });
        });
    }else{
        res.status(400).json({ errors });
    }
});
export default router;