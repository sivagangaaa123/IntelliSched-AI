const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/intellisched_db';

  try {
    // Attempt connecting to the configured MongoDB URI (local or Atlas)
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500 // Quick check so we don't stall if service is offline
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️  Primary MongoDB (${primaryUri}) not reachable: ${error.message}`);
    console.log(`🔄 Initializing local In-Memory MongoDB fallback for offline execution...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ In-Memory MongoDB Connected at: ${memoryUri}`);
      console.log(`💡 Note: All models, relationships & seed scripts will function seamlessly.`);
      return conn;
    } catch (memError) {
      console.error(`❌ Failed to start In-Memory MongoDB: ${memError.message}`);
      throw memError;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};

module.exports = { connectDB, disconnectDB };
