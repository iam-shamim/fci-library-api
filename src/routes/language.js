import express from 'express';
import authenticate from "../middlewares/authenticate";
import LanguageModel from "../Models/LanguageModel";
import commonValidations from "../validations/commonValidations";


let router = express.Router();

router.get('/',authenticate, (req,res)=>{
    LanguageModel.find().then((languages)=>{
        res.json({ languages });
    });

});

router.delete('/',authenticate, (req,res)=>{
    const { _id } = req.body;
    const update = LanguageModel.findOneAndDelete({_id:_id}).then(()=>{
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
        const update = LanguageModel.findOneAndUpdate({_id:_id},{$set:{name: name}},{ new:true }).then((language)=>{
            if(language===null){
                res.status(401).json({ errors: { _flash: 'Language Not found. Maybe deleted by another user'}});
            }
            res.json({ language });
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
        const Year = new LanguageModel({
            name
        });
        Year.save().then((language)=>{
            res.json({ language });
        });
    }else{
        res.status(400).json({ errors });
    }
});
export default router;