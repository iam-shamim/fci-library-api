import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    full_name: String,
    email: String,
    password: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});
const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;