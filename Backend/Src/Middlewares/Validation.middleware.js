const {body,validationResult} = require("express-validator")

const validateResult = async (req,res,next) => {
    const errors = await validationResult(req)

    if(!errors.isEmpty()) {

        const formattederrors = errors.array().reduce((acc,err)=>{
            if(!acc[err.path]){
                acc[err.path] = [];
            }
            acc[err.path].push(err.msg);
            return acc;
        },{});

        return res.status(400).json({errors : formattederrors});
    }
    next();
};

const registerUserValidationRule = [
    body("username")
    .isString()
    .withMessage("the username must be a string")
    .bail()
    .isLength({min : 3, max : 20})
    .withMessage("the username must be 3-20 characters long"),

    body("email")
    .isEmail()
    .withMessage("please enter a valid email"),

    body("password")
    .isString()
    .withMessage("the password must be a string")
    .bail()
    .isLength({min : 6})
    .withMessage("the password must contain at least 6 characters"),

    validateResult

]

module.exports = {registerUserValidationRule}