const express = require('express');
const router = express.Router();
const User=require('../model/User');
const Ticket=require('../model/Ticket');
const Status=require('../model/Status');
const validation=require('../validations/validator');
const userValidation = validation.userValidation;
const ticketValidation=validation.ticketValidation;

//API to issue a ticket
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

//API to fetch closed seats
router.get('/tickets/closed', (req, res) => {
    Ticket.find({ is_booked: true }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})

//API to fetch ticket status
router.get('/tickets/:sNumber', (req, res) => {
    const { sNumber } = req.params
    if(sNumber<1 || sNumber>40){
        return res.status(200).json("Invalid ticket number");
    }
    Ticket.find({ seat_number:sNumber }, (err, seat) => {
        if (err) res.status(404).json({ message: err })
        if (seat.length==1) res.status(200).json({ status:seat[0].is_booked })
        else res.status(200).json({ status:false })
    })
})

//API to fetch ticket owner details
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
        else{
            res.status(200).json("Ticket not found");
        }
    })
})

//API to close a ticket
router.put('/tickets/close/:sNumber', (req, res) => {
    const { sNumber } = req.params
    Ticket.findOne({seat_number:sNumber}, (err, ticket) => {
        if (err) res.status(404).json({ message: err })
        if (ticket) {
            User.deleteOne({_id:ticket.passenger},(err,udel)=> {
                if (err) res.status(404).json({ message: err })
                if (udel){
                    Ticket.deleteOne({seat_number:sNumber}, (err,tdel) =>{
                        if (err) res.status(404).json({ message: err })
                        if (tdel) res.status(200).json('Ticket is closed');
                    })
                }
            })
        }
        else{
            res.status(200).json("No such ticket exists");
        }
    })
})


//API to update ticket details
router.put('/tickets/update/:sNumber', (req, res) => {
    const { sNumber } = req.params
    const payload = req.body
    if(sNumber<1 || sNumber>40){
        return res.status(200).json("Invalid ticket number");
    }
    Ticket.findOne({seat_number:sNumber}, (err, ticket) => {
        if (err) res.status(404).json({ message: err })
        if (ticket) {
            const user_id = ticket.passenger
            User.findById(user_id)
                .then(user => {
                    if ('name' in payload) user.name = payload.name
                    if ('sex' in payload) user.sex = payload.sex
                    if ('age' in payload) user.age = payload.age
                    if ('phone' in payload) user.phone = payload.phone
                    user.save()
                        .then(data => res.status(202).json(data))
                        .catch(err => res.status(404).json({ message: err }))
                })
                .catch(err => res.status(404).json({ message: err }))
        }
        else{
            res.status(200).json("No such ticket exists");
        }
    })
})



//API to view availabe seats
router.get('/tickets/status/open', (req, res) => {
    let seat_stat;
    var unreserved_seats;
    const promise0 = new Promise(function(resolve, reject) {

        Status.find({id:"seat_details"}, (err,data)=>{
            if(err) reject();
            if(data){
                seat_stat=data[0].seat_status;
                //console.log(seat_stat);
                resolve();
            }
        })
    });

    promise0.then(
        ()=>{
            const promise1 = new Promise(function(resolve, reject) {
                Ticket.find({ is_booked: true }, (err, data) => {
                    if (err) reject();
                    if (data) {
                        data.forEach(element=>{
                            const index = seat_stat.indexOf(element.seat_number);
                            seat_stat.splice(index, 1);
                        })
                        unreserved_seats=JSON.stringify(seat_stat);
                        resolve ();
                    }
                })
              });
        
              promise1.then(
                  ()=>res.status(200).json({unreserved_seats}),
                  ()=>res.status(404).json({ message: err })
              )
        },
        ()=>res.status(404).json({ message: err })
    )

    

    
    
})




module.exports=router;