import {connect,disconnect} from 'mongoose';
export default async function connectToDatabase() {
    try {
        await connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
      throw new Error("Error connecting to MongoDB");
    }
}

async function disconnectFromDatabase() {
    try {
        await disconnect();
    } catch (error) {
        console.log(error);
      throw new Error("Error disconnecting from MongoDB");
    }
}

export {connectToDatabase,disconnectFromDatabase};