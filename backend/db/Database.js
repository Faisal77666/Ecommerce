const mongoose = require("mongoose");

let connectionPromise;

const connectDatabase = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);
  if (!connectionPromise) {
    if (!process.env.DB_URL) {
      return Promise.reject(new Error("DB_URL environment variable is not configured"));
    }
    connectionPromise = mongoose.connect(process.env.DB_URL)
      .then((mongooseInstance) => {
        console.log("MongoDB connection established");
        return mongooseInstance.connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }
  return connectionPromise;
};

module.exports = connectDatabase;
