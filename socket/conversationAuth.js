const mongoose = require("mongoose");
const connectDB = require("./db");

async function authorizeConversation(socket, conversationId, senderId, receiverId) {
  if (
    !mongoose.isValidObjectId(conversationId) ||
    !mongoose.isValidObjectId(senderId) ||
    !mongoose.isValidObjectId(receiverId)
  ) {
    return false;
  }

  const authorized = socket.data.identities.some(
    identity => identity.id === String(senderId)
  );

  if (!authorized || String(senderId) === String(receiverId)) {
    return false;
  }

  await connectDB();

  const conversation = await mongoose.connection.db
    .collection("conversations")
    .findOne(
      { _id: new mongoose.Types.ObjectId(conversationId) },
      { projection: { members: 1 } }
    );

  if (!conversation || !Array.isArray(conversation.members)) {
    return false;
  }

  const members = conversation.members.map(String);

  return members.includes(String(senderId)) &&
         members.includes(String(receiverId));
}

module.exports = authorizeConversation;
