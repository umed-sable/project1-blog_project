
const jwt = require('jsonwebtoken')
const blogModel = require("../models/blogModel")
const AuthorModel = require("../models/AuthorModel")
const { status } = require("express/lib/response")


////     creating_Blog    /////


const createBlog = async (req, res) => {

    try {
        let blog = req.body
        if (Object.keys(blog).length === 0) {
            res.status(400).send({ status: false, msg: " Add Some Content To The Body" })
        }
        let authorId = req.body.authorId
        if (!authorId) {
            return res.status(400).send({ msg: "AuthorId Is required for Create Blogs" })
        }

        let author = await AuthorModel.findById(authorId)

        if (!author) {
            return res.status(404).send({ msg: "Author Not Found" })
        }

        let blogCreated = await blogModel.create(blog)
        return res.status(201).send({ data: blogCreated })

    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}


////    getting blog    ////


const getBlogs = async function (req, res) {

    try {

        let filters = req.query

        if (Object.keys(filters).length == 0) {
            return res.status(400).send({ status: false, msg: "filters Are Required" })
        }
        let avilableBlogs = await blogModel.find({ $and: [filters, { isDeleted: false }, { isPublished: true }] }).populate("authorId")

        if (avilableBlogs.length == 0) {
            return res.status(404).send({ status: false, msg: "No Book Found For Given info" })
        }
        return res.status(200).send({ status: true, msg: avilableBlogs })

    } catch (err) {
        res.status(500).send({ Error: err.message })
    }
}



////     Updating_Blog       ////


const updateBlogs = async (req, res) => {

    try {

        let Id = req.params.blogId
        let ifExist = await blogModel.findById(Id)

        if (!ifExist) {
            return res.status(404).send({ status: false, msg: "Blog Not Found" })
        }

        if (ifExist.isDeleted == false) {

            let data = req.body
            let newTitle = req.body.title
            let newBody = req.body.body
            let newTags = req.body.tags
            let newSubCategory = req.body.subcategory

            let updatedBlog = await blogModel.findByIdAndUpdate({ _id: Id },
                {
                    $set: { title: newTitle, body: newBody, isPublished: true, publishedAt: Date.now() },
                    $push: { tags: newTags, subcategory: newSubCategory }
                },
                { new: true })

            console.log(updatedBlog)
            return res.status(200).send({ Status: true, data: updatedBlog })

        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



////    Deleting_data     ////


const deleteById = async (req, res) => {

    try {

        let Id = req.params.blogId

        let ifExists = await blogModel.findById(Id)

        if (!ifExists) {
            return res.status(404).send({ Status: false, msg: "Data Not Found" })
        }

        if (ifExists.isDeleted !== true) {

            let deleteBlog = await blogModel.findByIdAndUpdate({ _id: Id }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
            return res.status(200).send()

        } else {
            return res.status(400).send({ status: false, msg: "alredy deleted" })
        }


    } catch (error) {
        res.status(500).send({ Err: error.message })
    }
}

///////     DeleteBy_QueryParams      /////

const DeleteBy_QueryParams = async (req, res) => {

    try {

        let token = req.headers["x-api-key"]
        if(!token){
        return res.status(400).send( { status : false , msg : "token Must Be Present" } )
        }

        let decodeToken = jwt.verify(token,"this-is-aSecretTokenForLogin")
        if(!decodeToken){
        return res.status(401).send( { status : false , msg : "Invalid Token" } )
        }
        let loggedInAuthor = decodeToken.authorId

        let filters = req.query

        if(!filters.authorId){
            filters.authorId = loggedInAuthor
        }

        if(loggedInAuthor != filters.authorId){
            return res.status(401).send( { status: false , msg : "User logged is not allowed to modify the requested users data" } )
        }
        
        console.log(filters)
        let ifExists = await blogModel.find(filters)


        if (!ifExists) {
            return res.status(404).send({ Status: false, msg: "Data Not Found" })
        }

        for (let i = 0; i < ifExists.length ; i++) {

            if (ifExists[i].isDeleted !== true) {

                let deleteBlog = await blogModel.updateMany({ $and: [ filters , { isDeleted: false } ] },
                    { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
                return res.status(200).send()

            } else {
                return res.status(400).send({ status: false, msg: "Alredy Deleted" })
            }

        }

    } catch (error) {
        res.status(500).send({ Err: error.message })
    }
}


module.exports = { createBlog, getBlogs, updateBlogs, deleteById, DeleteBy_QueryParams }
