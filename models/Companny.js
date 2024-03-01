import mongoose from "mongoose";
const Company=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    CompanyDescription:{
        type:String,
        required:true
    }
})
export default mongoose.model('Company', Company)