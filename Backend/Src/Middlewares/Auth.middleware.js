const jwt = require("jsonwebtoken");

const authArtist = async (req,res,next)=>{

    const token = req.cookies.token

    if(!token) {
        return res.status(401).json({
            message : "unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(decoded.role !== "artist"){
            return res.status(401).json({
                message : "you are not authorized to create a music/album"
            })
        }
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            message : err.message
        })
    }
}

const authUser = async (req,res,next) => {
    const token = req.cookies.token

    if(!token) {
        return res.status(401).json({
            message : "unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(decoded.role !== "user" && decoded.role !== "artist"){
            return res.status(401).json({
                message : "you are not an authorized user "
            })
        }
        req.user = decoded;
        next()
    } 
    catch(err){
        return res.status(401).json({
            message : err.message
        })
    }
}

module.exports = {authArtist,authUser}