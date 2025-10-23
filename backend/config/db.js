import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://basil59mutuku_db_user:cjq6UZRoK2Bg4cYX@plp.ycdlukc.mongodb.net/Agriculture?retryWrites=true&w=majority&appName=PLP');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
