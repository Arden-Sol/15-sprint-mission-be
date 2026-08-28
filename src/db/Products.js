import mongoose from 'mongoose';
import { config } from '../config/config.js';

export const connectDB = async () => {
  await mongoose.connect(config.MONGO_URI);
  console.log('Mongo DB connected');
};
