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
      const os = require('os');
      const path = require('path');
      const fs = require('fs');

      // Ensure a dedicated writable temp and cache directory on Windows
      const safeTempDir = path.join(os.homedir(), '.cache', 'mongodb-temp');
      const safeBinaryDir = path.join(os.homedir(), '.cache', 'mongodb-binaries');
      if (!fs.existsSync(safeTempDir)) fs.mkdirSync(safeTempDir, { recursive: true });
      if (!fs.existsSync(safeBinaryDir)) fs.mkdirSync(safeBinaryDir, { recursive: true });

      if (process.platform === 'win32') {
        process.env.TEMP = safeTempDir;
        process.env.TMP = safeTempDir;
      }

      mongodInstance = await MongoMemoryServer.create({
        binary: {
          downloadDir: safeBinaryDir
        }
      });
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
