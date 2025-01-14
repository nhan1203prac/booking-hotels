import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { createError } from "../until/error.js";
export const register = async(req,res,next)=>{
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            ...req.body,
            password:hash
        })
        await newUser.save()
        res.status(200).send("User has been created.")
    } catch (error) {
        next(error)
    }
}

export const login = async(req,res,next)=>{
    console.log("Request Body:", req.body);
    try {
       const user = await User.findOne({username:req.body.username})
       if(!user) return next(createError(404,"User not found!"))
       const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
       if(!isPasswordCorrect) return next(createError(400,"Wrong username or password!"))
       const token = jwt.sign({id:user._id,isAdmin:user.isAdmin},"vi1a8JuK7MQo7NhCzH4MkE3-iC_jCRyhOFiOCl2hmZI")
       const {password,isAdmin,...otherDetails} = user._doc;
       res.cookie("access_token",token,{httpOnly:true}).status(200).json({detail:{...otherDetails},isAdmin})
    } catch (error) {
        // next(error)
        // console.log(error)
        next(error)


    }
}