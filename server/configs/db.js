import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        mongoose.connection.on('connected', ()=>console.log('✓ Database Connected'));
        mongoose.connection.on('error', (err)=>console.error('✗ Database Error:', err));

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        })
        console.log('✓ Mongoose connected to MongoDB');
    } catch (error){
        console.error('✗ Database Connection Failed:', error.message);
        throw error;
    }
}

export default connectDB;