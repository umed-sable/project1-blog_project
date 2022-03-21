


const AuthorModel= require("../models/AuthorModel")
const jwt = require("jsonwebtoken")

const createAuthor = async function (req,res) {
try{
    
    let user = req.body
    if(Object.keys(user).length !== 0){

        let userCreated = await AuthorModel.create(user)
        res.send({data: userCreated})

    }else { res.status(400).send( { msg : "Please Add Some Content " } )}
    
    
}catch(err){res.status(500).send( { msg : err.message } )}
}



////   login_Part   ////

const loginAuthor = async function (req, res) {


try {

    let userName = req.body.emailId;
    let password = req.body.password;
  
    let Author = await AuthorModel.findOne({ emailId: userName, password: password });
  
    if (!Author)
      return res.status(404).send( { status: false, msg: "Author Not Found",} );
  
  
      let token = jwt.sign(
      {
        authorId: Author._id.toString(),
        groupno: "42"
      },
      "this-is-aSecretTokenForLogin"
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({ status: true, data: token });


  
} catch (error) {
  return res.status(500).send( { Err : error.message } )
}
    
};


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor
