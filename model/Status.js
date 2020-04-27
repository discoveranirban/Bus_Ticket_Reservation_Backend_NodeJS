const mongoose=require('mongoose');

const SSchema=new mongoose.Schema({
    id:{type:String, default:"seat_details",unique:true},
    seat_status:{type:Array}
});

module.exports = mongoose.model('SeatStatus', SSchema);