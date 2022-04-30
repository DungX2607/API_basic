const User = require("../models/User");

const userController = {
    //Get all users
    getAllUsers: async(req,res)=>{
        try{
            const users = await User.find();
            res.status(200).json(users);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //Delete user
    deleteUser: async(req,res)=>{
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete user successfully!");
        }catch(err){
            res.status(500).json(err);
        }
    }
}

module.exports = userController;