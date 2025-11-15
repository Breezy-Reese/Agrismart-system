import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://basil59mutuku_db_user:08YUxkMvjTzjko1Y@plp.ycdlukc.mongodb.net/Agriculture?appName=PLP');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
