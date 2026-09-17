const userModel = require("../Models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const registerUser = async(req,res)=>{
    try{
    const {username,email,password,role='user'} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or : [
            {username},
            {email}
        ]
    })
    if(isUserAlreadyExists) {
        return res.status(400).json({
            message : "user already exists"
        })
    }

    const hash = await bcrypt.hash(password ,10);

    const user = await userModel.create({
        username,
        email,
        password : hash,
        role,
    })
    const token = jwt.sign({id : user._id,role : user.role},process.env.JWT_SECRET);
    res.cookie("token",token,{
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    return res.status(201).json({
        message : "user registered"
    })
    }
     catch(err){
        return res.status(500).json({
            message : err.message
        });
    }
}

const loginUser = async(req,res) => {
    const {username,email,password} = req.body;

    const user = await userModel.findOne({
        $or : [
            {username},
            {email}
        ]
    })
    if(!user) {
        return res.status(401).json({
            message : "Invalid Credentails"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message : "wrong password entered"
        })
    }

    const token = jwt.sign({id : user._id,role : user.role,username: user.username},process.env.JWT_SECRET);

    res.cookie("token",token,{
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    return res.status(200).json({
    message: `${username || email} is logged In`,
    user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
});

}

const LogoutUser = async(req,res) => {
    res.clearCookie("token");
    res.status(200).json({
        message : "user logged out"
    })
}

const getCurrentUser = async(req,res) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message : "token does not exist"
        });
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password')

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            user
        });
    }catch(err){
        return res.status(401).json({
            message : err.message
        })
    }
}

module.exports = {registerUser, loginUser, LogoutUser, getCurrentUser};