

const jwt = require("jsonwebtoken")

const AuthorModel = require("../models/AuthorModel");
const blogModel = require("../models/blogModel");

////  Authenication_Part  ////

const verifyUser =async (req ,res , next) =>{

try {

    let token = req.headers["x-api-key"]
    if(!token){
        return res.status(400).send( { status : false , msg : "token Must Be Present , You Have To Login First" } )
    }

    let decodeToken = jwt.verify(token,"this-is-aSecretTokenForLogin")
    if(!decodeToken){
        return res.status(401).send( { status : false , msg : "Invalid Token" } )
    }

    let data = req.body

    if(Object.keys(data).length !== 0){

        if(data.authorId !== decodeToken.authorId){
            return res.status(403).send( { status : false , msg :"you are Not Authorized !" } )
        }

    }else{

        let userId = req.params.userId
        let isValidUser = await AuthorModel.findById(userId)
        if(!isValidUser){
            return res.status(403).send({status : false , msg : "you do not Have access to This data !"})

        }
        
    }
    
  
  next()

} catch (error) { 
    return res.status(500).send( { Error : error.message } )
}
};


////   authorization_Part   ////

let authorization = async (req, res, next) => {

    try {

        let token = req.headers["x-api-key"]
        if(!token){
        return res.status(400).send( { status : false , msg : "token Must Be Present" } )
        }

        let decodeToken = jwt.verify(token,"this-is-aSecretTokenForLogin")
        if(!decodeToken){
        return res.status(401).send( { status : false , msg : "Invalid Token" } )
        }

        let blogId = req.params.blogId
        
        let blog = await blogModel.findById(blogId)
        if(!blog){
            return res.status(404).send( { status : false , msg : "Blog Not Found , Please Check Blog Id"  } )
        }
     
        let ownerOfBlog = blog.authorId
     

        if(decodeToken.authorId != ownerOfBlog){
            return res.status(403).send( { status : false , msg : "User logged is not allowed to modify the requested users data" } )
        }
        
        next()

    } catch (error) {
        res.send(error.message)
    }

};

module.exports.authorization = authorization
module.exports.verifyUser = verifyUser
