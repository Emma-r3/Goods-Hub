import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ [MongoDB Connection Warning]: ${error.message}`);
    console.error(`ℹ️ Tips: Pastikan MongoDB lokal berjalan atau gunakan MongoDB Atlas (Cloud) gratis dengan memperbarui MONGO_URI di file backend/.env`);
  }
};

export default connectDB;
