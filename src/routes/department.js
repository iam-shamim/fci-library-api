import express from 'express';
import authenticate from "../middlewares/authenticate";
import DepartmentModel from "../Models/DepartmentModel";
import commonValidations from "../validations/commonValidations";


let router = express.Router();

router.get('/',authenticate, (req,res)=>{
    DepartmentModel.find().then((departments)=>{
        res.json({ departments });
    });

});

router.delete('/',authenticate, (req,res)=>{
    const {  _id } = req.body;
    const update = DepartmentModel.findOneAndDelete({_id:_id}).then(()=>{
        res.json({
            success: true
        })
    });
});
router.put('/',authenticate, (req,res)=>{
    const { departmentName, _id } = req.body;
    const { errors, isValid } = commonValidations({departmentName},{
        departmentName: 'required'
    });

    if(isValid){
        const update = DepartmentModel.findOneAndUpdate({_id:_id},{$set:{name: departmentName}},{ new:true }).then((department)=>{
            if(department===null){
                res.status(401).json({ errors: { _flash: 'Department Not found. Maybe deleted by another user'}});
            }
            res.json({ department });
        });
    }else{
        res.status(400).json({ errors });
    }
});
router.post('/',authenticate, (req,res)=>{
    const { departmentName } = req.body;
    const { errors, isValid } = commonValidations({departmentName},{
        departmentName: 'required'
    });

    if(isValid){
        const Year = new DepartmentModel({
            name: departmentName
        });
        Year.save().then((department)=>{
            res.json({ department });
        });
    }else{
        res.status(400).json({ errors });
    }
});
export default router;