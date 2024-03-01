import mongoose from 'mongoose';

const connect=async(url)=>{
    await mongoose.connect(url)
}
export default connect