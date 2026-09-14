const mongoose=require('mongoose');
module.exports=mongoose.model('PdfFile',new mongoose.Schema({title:{type:String,required:true},category:{type:String,enum:['warranty','certificates','other'],default:'other'},filePath:{type:String,required:true},publicId:String,order:{type:Number,default:0}},{timestamps:true}));
