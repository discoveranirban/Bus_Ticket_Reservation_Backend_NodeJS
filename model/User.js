const mongoose=require('mongoose');

const USchema=new mongoose.Schema({
    delId:{type:String, default:"del_U"},
    name:String,
    sex:String,
    age:Number,
    phone:{type:String, unique:true}
});

module.exports = mongoose.model('User', USchema);

