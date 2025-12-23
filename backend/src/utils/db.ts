import mongoose from 'mongoose';

export async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI missing in environment');
  }

  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(uri, {
    autoIndex: true
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongo connection error', err);
  });
}
