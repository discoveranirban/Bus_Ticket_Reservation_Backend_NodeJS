const express = require('express');
const router = express.Router();
const User=require('../model/User');
const Ticket=require('../model/Ticket');
const validation=require('../validations/validator');
const userValidation = validation.userValidation;
const ticketValidation=validation.ticketValidation;


router.post('/issue', (req,res)=>{
    
    let [result, data] = userValidation(req.body.passenger);
    if (!result) return res.status(500).json('Please check the passenger details');
    if(req.body.seat_number<1||req.body.seat_number>40) return res.status(500).json('Please select from the available range 1-40'); 
    ticketValidation(req.body.seat_number).then(
        ()=>{
            const ticket = new Ticket({ seat_number: req.body.seat_number });
            const { name,sex,age,phone }= req.body.passenger;
            const user=new User({
                name,
                sex,
                age,    
                phone
            });
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

        },
        ()=>{
            return res.status(500).json('Seat not available');
        }
    );
});

    

    // //(Another Pattern)
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


    // const ticket = new Ticket({ seat_number: req.body.seat_number });
    // const { name,sex,age,phone }= req.body.passenger;
    // const user=new User({
    //     name,
    //     sex,
    //     age,    
    //     phone
    // });
    // user.save(function(err,data){
    //     if(err){
    //         res.status(500).json('Server error');
    //     }
    //     if(data){
    //         ticket.passenger=user._id;
    //         ticket.save(function(err,result){
    //             if(err){
    //                 User.findOneAndDelete({_id:user._id})
    //                 .then((data) => res.status(400))
    //                 .catch(err => res.status(400).json({ message: err }));
    //             }   
    //             if(result){
    //                 res.json(result);
    //             }

    //         })
    //     }

    // })





router.get('/tickets/closed', (req, res) => {
    Ticket.find({ is_booked: true }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})

router.get('/tickets/:sNumber', (req, res) => {
    const { sNumber } = req.params
    Ticket.find({ seat_number:sNumber }, (err, seat) => {
        if (err) res.status(404).json({ message: err })
        if (seat.length==1) res.status(200).json({ status:seat[0].is_booked })
        else res.status(200).json({ status:false })
    })
})


router.get('/tickets/details/:sNumber', (req, res) => {
    const { sNumber } = req.params
    Ticket.findOne({seat_number:sNumber}, (err, ticket) => {
        if (err) res.status(404).json({ message: err })
        if (ticket) {
            User.findById(ticket.passenger, (err, user) => {
                if (err) res.status(404).json({ message: err })
                if (user) res.status(200).json(user)
            })
        }
    })
})







module.exports=router;