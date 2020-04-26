const Joi = require('joi')
const Ticket=require('../model/Ticket');

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

// function ticketValidation(seat_number){

//     let result = null

//     Ticket.findOne({seat_number})
//           .then(function(doc){
//               if(!doc){
//                   console.log("if");
//                   result=true;
//               }
//               else{
//                   console.log("el");
//                   result=false;
//               }
//           })
//     return result;
// }


function ticketValidation(seat_number){

    return new Promise((resolve,reject)=>{
        Ticket.findOne({seat_number})
          .then(function(doc){
              if(!doc){
                  //console.log("if");
                  resolve();
              }
              else{
                  //console.log("el");
                  reject();
              }
          })
    });
}



module.exports = {
    userValidation: userValidation,
    ticketValidation: ticketValidation
}