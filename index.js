const express=require('express');
const connectDB=require('./config/db');
const SeatStatus=require('./model/Status');

const app=express();

connectDB();

app.use(express.json({extended:false}));

var seat_stat=new Array(50);
seat_stat.fill(true);
const availibity=new SeatStatus({seat_Status:seat_stat});
availibity.save(function(err,data){
    if(err){
        console.log("please check")
    }
    if(data){
        console.log("initialized")
    }
})



app.use('/api',require('./routes/ticket'));

const PORT=5000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));


