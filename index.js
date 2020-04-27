const express=require('express');
const connectDB=require('./config/db');
const Status=require('./model/Status');
const Ticket=require('./model/Ticket');
const mongoose=require('mongoose');

const app=express();

connectDB();

app.use(express.json({extended:false}));


let mySet = new Array();
for(var i=1;i<41;i++){
    mySet.push(i);
}

Status.deleteMany({id:"seat_details"},(err,result) => {
    if(err) console.log("Please restart the server");
    else{
        const unreserved=new Status({seat_status:mySet});
        unreserved.save(function(err,data){
            if(err) console.log("Please restart the server");
            if(data) console.log("Seats Initialized");
        })
    }
})

// const unreserved=new Status({seat_status:mySet});
//     unreserved.save(function(err,data){
//         if(err) console.log("Please restart the server");
//         if(data) console.log("Seats details fetched");
//     })

// const promise1 = new Promise(function(resolve, reject) {
//     Ticket.find({ is_booked: true }, (err, data) => {
//         if (err) reject();
//         if (data) {
//             data.forEach(element=>{
//                 const index = mySet.indexOf(element.seat_number);
//                 mySet.splice(index, 1);
//             })
//             resolve (mySet);
//         }
//     })
//   });

//   promise1.then(
//       ()=>{
//         const unreserved=new Status({seat_status:mySet});
//         unreserved.save(function(err,data){
//             if(err) console.log("Please restart the server");
//             if(data) console.log("Seats details fetched");
//         })
//       },
//       ()=>console.log("Please restart the server")
//   )



app.use('/api',require('./routes/ticket'));

const PORT=5000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));


