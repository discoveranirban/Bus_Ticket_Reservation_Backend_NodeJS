const express = require('express');
const router = express.Router();
const User=require('../model/User');
const Ticket=require('../model/Ticket');
const validation=require('../validations/validator');
const userValidation = validation.userValidation;


router.post('/issue', (req,res)=>{
    
    let [result, data] = userValidation(req.body.passenger);
    if (!result) return res.status(500).json('Data error');
    const ticket = new Ticket({ seat_number: req.body.seat_number });
    const { name,sex,age,phone }= req.body.passenger;
    const user=new User({
        name,
        sex,
        age,    
        phone
    });

    // user.save()
    //     .then(data => {
    //         if (data) {
    //             ticket.passenger = user._id
    //             ticket.save()
    //                 .then(data => res.status(200).json(data))
    //                 .catch(err => {
    //                     User.findOneAndDelete({ _id: user._id })
    //                         .then((data) => res.status(400))
    //                         .catch(err => res.status(400).json({ message: err }))
    //                 })
    //         }
    //     })
    //     .catch(err => res.status(404).json({ message: err }))


    user.save(function(err,data){
        if(err){
            res.status(500).json('Server error');
        }
        if(data){
            ticket.passenger=user._id;
            ticket.save(function(err,result){
                if(err){
                    User.findOneAndDelete({_id:user._id})
                    .then((data) => res.status(400))
                    .catch(err => res.status(400).json({ message: err }));
                }   
                if(result){
                    res.json(result);
                }

            })
        }

    })

    // try{
    //     user=new User({
    //         name,
    //         sex,
    //         age,
    //         phone
    //     });

    //     await user.save();
    //     res.json(user);

    // } catch(err){

    //     console.error(err);
    //     res.status(500).json('Server error');

    // }

});


module.exports=router;