

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true , 'Title Is Required']
    },

    body: {
        type: String,
        required: [true ,'Body Should Not Be Empty' ]
    },

    authorId: {
        type : ObjectId,
        ref : "Author"
    },
    tags: {
        type: Array,
        required : [true, 'tags are required'],
        unique : [true, 'please enter unique tags']
       
    },
    category: {
        type: Array,
        required: true
    },
    subcategory:{
        type : Array ,
    },
    
    isPublished : {
        type : Boolean ,
        default : false

    },
    publishedAt : {
        type : Date
    },
    isDeleted : {
        type : Boolean ,
        default : false
    },
    deletedAt : {
        type : Date ,
        
    }

}, { timestamps: true });


module.exports = mongoose.model('Blog', blogSchema)
