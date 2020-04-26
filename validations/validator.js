const Joi = require('joi')


function userValidation(user){
    const userValSchema=Joi.object().keys({
        name:Joi.string().trim().min(5).max(100).required(),
        sex: Joi.string().trim().max(1).required(),
        age: Joi.number().min(18).required(),
        phone: Joi.string().trim().max(10).required()
    })
    let result = null
    Joi.validate(user, userValSchema, (err, data) => {
        if (err) {
            result = [false, err]
        }
        else {
            //let d="an error man!";
            result = [true, data]
        }
    })
    return result
}


module.exports = {
    userValidation: userValidation
}