const  mentorSchema = new Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phoneno:{
        type: String,
        required: true,
        unique: true
    },
    organization:{
        type: String,
        required: true
    },
    githubProfile:{
        type: String,
        required: true,
        unique: true
    },
    otherProfile:{
        type: String,
        required: true,
        unique: true
    },
    projectLinks:{
        type: Array,
        required: true
    },
    willReview:{
        type: Boolean,
        required: true
    },
    firstTime:{
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Mentor', mentorSchema);