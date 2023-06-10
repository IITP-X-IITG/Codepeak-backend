const projectSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required:true
    },
    tags:{
        type: Array,
        required: true
    },
    mentor:{
        type: String,
        required: true
    },
    mentorGithub:{
        type: String,
        required: true
    },
    languages:{
        type: Array,
        required: true
    },
    githubLink:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
    },
    sponsored:{
        type: Boolean,
        required: true
    },
    year:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Project', projectSchema);