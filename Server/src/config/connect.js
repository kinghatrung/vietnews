import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URL_DATABASE = process.env.MONGODB_URL;

export async function connect() {
  try {
    await mongoose.connect(URL_DATABASE);
    console.log('Kết nối đến database thành công');
  } catch (error) {
    console.error('Kết nối đến database thất bại:', error);
  }
}
