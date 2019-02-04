import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../Models/UserModel';

export default (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    let token;
    if(authorizationHeader){
        token = authorizationHeader.split(' ')[1];
    }
    if(token){
        jwt.verify(token, config.jwtSecret, (err,decode)=>{
            if(err){
                res.status(401).json({ errors: {global: 'Failed to authenticate'}});
            }else{
                const userFind = UserModel.findOne({
                    _id: decode._id,
                    email: decode.email,
                }).then((user)=>{
                    if(user){
                        req.currentUser = decode;
                        next();

                    }else{
                        res.status(401).json({ errors: { form: 'Invalid Credentials'}});
                    }
                });

            }
        });
    }else{
        res.status(403).json({
            errors: {global: 'No token provided' }
        });
    }

}