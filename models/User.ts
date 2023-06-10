const mongoose = require('mongoose');
const { Schema } = mongoose;
const  userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true
    },
    // 0 for mentor and 1 for student
    type:{
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);