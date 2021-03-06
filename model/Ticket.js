const mongoose=require('mongoose');
const User=require('../model/User');

const TSchema = mongoose.Schema({
    delId:{type:String, default:"del_T"},
    seat_number: { type: Number, min: 1, max: 40, required: true },
    is_booked: { type: Boolean, default: true },
    date: { type: Date, default: Date.now() },
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Ticket', TSchema);

