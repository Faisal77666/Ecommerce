const mongoose = require("mongoose");

let connectionPromise;

function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (!process.env.DB_URL) {
    return Promise.reject(new Error("Socket DB_URL is missing"));
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.DB_URL)
      .then(() => {
        console.log("Socket MongoDB connected");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
