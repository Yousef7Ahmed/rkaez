const mongoose=require('mongoose');
module.exports=mongoose.model('Admin',new mongoose.Schema({username:{type:String,unique:true,required:true},passwordHash:{type:String,required:true}},{timestamps:true}));
