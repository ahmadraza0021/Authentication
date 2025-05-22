import mongoose from 'mongoose';

export const ConnectDB = (ahmed) => {
  return mongoose.connect(ahmed);
};
