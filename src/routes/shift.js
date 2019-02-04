import express from 'express';
import authenticate from "../middlewares/authenticate";
import ShiftModel from "../Models/ShiftModel";
import commonValidations from "../validations/commonValidations";


let router = express.Router();

router.get('/',authenticate, (req,res)=>{
    ShiftModel.find().then((shifts)=>{
        res.json({ shifts });
    });

});

router.delete('/',authenticate, (req,res)=>{
    const { _id } = req.body;
    const update = ShiftModel.findOneAndDelete({_id:_id}).then(()=>{
        res.json({
            success: true
        })
    });
});
router.put('/',authenticate, (req,res)=>{
    const { shiftName, _id } = req.body;
    const { errors, isValid } = commonValidations({shiftName},{
        shiftName: 'required'
    });

    if(isValid){
        const update = ShiftModel.findOneAndUpdate({_id:_id},{$set:{name: shiftName}},{ new:true }).then((shift)=>{
            if(shift===null){
                res.status(401).json({ errors: { _flash: 'Shift Not found. Maybe deleted by another user'}});
            }
            res.json({ shift });
        });
    }else{
        res.status(400).json({ errors });
    }
});
router.post('/',authenticate, (req,res)=>{
    const { shiftName } = req.body;
    const { errors, isValid } = commonValidations({shiftName},{
        shiftName: 'required'
    });

    if(isValid){
        const Year = new ShiftModel({
            name: shiftName
        });
        Year.save().then((shift)=>{
            res.json({ shift });
        });
    }else{
        res.status(400).json({ errors });
    }
});
export default router;