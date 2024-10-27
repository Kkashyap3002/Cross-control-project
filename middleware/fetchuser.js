var jwt = require("jsonwebtoken");
require('dotenv').config()
const Users=require('../schema/users')

const fetchuser = async (req, res, next) => {
  //Get the user from JWT token and add id to thse reqd object
  try {

    const token = req.header("auth-token");
    if (!token) {
      return res.status(401).json({ error: "Authenticate using a valid token" });
    }
    const name=req.body.userName
    const findUser = await Users.findOne({name: name})
    if(!findUser)
    return res.status(404).send("Invalid User Credentials")
    const data = jwt.verify(token, findUser.userSecret);

    req.userId= data.userId;
    req.userSecret=findUser.userSecret

    next();
  }
  catch (error) {
    console.error(error.message);
    return res.status(401).json({error:"Internal Server Error Occured"})
  }
};

module.exports = fetchuser;