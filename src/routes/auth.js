const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const User = require('../models/user');
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req,res) => {
    
    try {
     //validation of data
     validateSignUpData(req);
     
 
     const {firstName, lastName, emailId, password} = req.body;
     
    //encrypt the password
     const passwordHash =  await bcrypt.hash(password,10);
        
 
 
     //creating a new instance of the user
     const user = new User({
         firstName,
         lastName,
         emailId,
         password: passwordHash,
     });
 
     
     
     await user.save();
     res.send("MISSION DATA SUCCESSFULL")
     } catch (err) {
         res.status(400).send("error saving the user" + err.message);
     }
    
 });


authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId : emailId});
        if(!user) {
            throw new Error("INVALID CREDENTIALS")
        }

        const isPasswordValid =  await user.validatePassword(password)

        if(isPasswordValid) {
            
            const token = await user.getJWT();
            

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8*3600000),
            });
            res.send("LOGIN SUCCESSFULL");
        }
        else{
            throw new Error(" INVALID CREDENTIALS")
        }
        





        
    } catch (err) {
        res.status(400).send("ERROR" + err.message);
    }

}); 

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    .send("User has been Logged out succesfully");
});









module.exports = authRouter;