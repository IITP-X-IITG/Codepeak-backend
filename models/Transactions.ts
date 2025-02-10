import { Schema, model } from 'mongoose'

const transactionSchema = new Schema({
    student : {
        type: String,
        required: true,
    },
    mentor : {
        type: String,
        required: true,
    },
    project : {
        type: String,
        required: true,
    },
    points : {
        type: Number,
        required: true
    },

});
module.exports = model('transaction', transactionSchema)