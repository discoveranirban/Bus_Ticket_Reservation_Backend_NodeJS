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


app.use('/api',require('./routes/ticket'));

const PORT=5000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));


