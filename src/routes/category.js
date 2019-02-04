import express from 'express';
import authenticate from "../middlewares/authenticate";
import CategoryModel from "../Models/CategoryModel";
import commonValidations from "../validations/commonValidations";


let router = express.Router();

router.get('/',authenticate, (req,res)=>{
    CategoryModel.find().then((categories)=>{
        res.json({ categories });
    });

});

router.delete('/',authenticate, (req,res)=>{
    const { _id } = req.body;
    const update = CategoryModel.findOneAndDelete({_id:_id}).then(()=>{
        res.json({
            success: true
        })
    });
});
router.put('/',authenticate, (req,res)=>{
    const { name, _id } = req.body;
    const { errors, isValid } = commonValidations({name},{
        name: 'required'
    });

    if(isValid){
        const update = CategoryModel.findOneAndUpdate({_id:_id},{$set:{name: name}},{ new:true }).then((category)=>{
            if(category===null){
                res.status(401).json({ errors: { _flash: 'Category Not found. Maybe deleted by another user'}});
            }
            res.json({ category });
        });
    }else{
        res.status(400).json({ errors });
    }
});
router.post('/',authenticate, (req,res)=>{
    const { name } = req.body;
    const { errors, isValid } = commonValidations({name},{
        name: 'required'
    });

    if(isValid){
        const Year = new CategoryModel({
            name
        });
        Year.save().then((category)=>{
            res.json({ category });
        });
    }else{
        res.status(400).json({ errors });
    }
});
export default router;