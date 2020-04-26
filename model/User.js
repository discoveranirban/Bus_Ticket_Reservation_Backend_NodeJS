const mongoose=require('mongoose');

const USchema=new mongoose.Schema({
    name:String,
    sex:String,
    age:Number,
    phone:{type:String, unique:true}
});

module.exports = mongoose.model('User', USchema);

