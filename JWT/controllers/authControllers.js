const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const authController = {
    //register
    registerUser: async(req, res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            //save to DB
            const user = await newUser.save();
                res.status(200).json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //login
    loginUser: async(req, res)=>{
        try{
            const user = await User.findOne({username: req.body.username});
            if(!user){
                res.status(400).json({message: "User not found!"});
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if(!validPassword){
                res.status(400).json("Wrong Password!")
            }
            if(user && validPassword){
                const accessToken = jwt.sign({
                    id: user.id,
                    admin: user.admin
                },
                "secret-key",
                {expiresIn: "1h"}, //time jwt expires
                );
                const {password, ...others} = user._doc;
                res.status(200).json({...others, accessToken});
            }
        }catch(err){
            res.status(500).json(err);
        }
    }
};

module.exports = authController;