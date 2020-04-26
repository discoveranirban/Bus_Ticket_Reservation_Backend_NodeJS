const mongoose=require('mongoose');

const SSchema=new mongoose.Schema({
    seat_Status:{type:Array, default: []}
});

module.exports = mongoose.model('SeatStatus', SSchema);

