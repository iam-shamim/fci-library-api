import express from 'express';
import authenticate from "../middlewares/authenticate";
import YearModel from "../Models/YearModel";
import commonValidations from "../validations/commonValidations";


let router = express.Router();

router.get('/',authenticate, (req,res)=>{
    YearModel.find().then((years)=>{
        res.json({ years });
    });

});

router.delete('/',authenticate, (req,res)=>{
    const {  _id } = req.body;
    const update = YearModel.findOneAndDelete({_id:_id}).then(()=>{
        res.json({
            success: true
        })
    });
});
router.put('/',authenticate, (req,res)=>{
    const { yearName, _id } = req.body;
    const { errors, isValid } = commonValidations({yearName},{
        yearName: 'required'
    });

    if(isValid){
        const update = YearModel.findOneAndUpdate({_id:_id},{$set:{name: yearName}},{ new:true }).then((year)=>{
            if(year===null){
                res.status(401).json({ errors: { _flash: 'Year Not found. Maybe deleted by another user'}});
            }
            res.json({ year });
        });
    }else{
        res.status(400).json({ errors });
    }
});
router.post('/',authenticate, (req,res)=>{
    const { yearName } = req.body;
    const { errors, isValid } = commonValidations({yearName},{
        yearName: 'required'
    });

    if(isValid){
        const Year = new YearModel({
            name: yearName
        });
        Year.save().then((year)=>{
            res.json({ year });
        });
    }else{
        res.status(400).json({ errors });
    }
});
export default router;