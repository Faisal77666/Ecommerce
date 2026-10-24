const authorizeConversation = require('./conversationAuth');
const mongoose = require("mongoose");
const connectDB = require("./db");
const authenticateSocket = require('./auth');

const socketIO=require('socket.io');
const http=require('http');
const express=require('express');
const cors=require('cors');
const app=express();
const server=http.createServer(app);
const io=socketIO(server, { path: "/api/socket", addTrailingSlash: false, cors: { origin: (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map((origin) => origin.trim()), credentials: true } })
const dotenv=require('dotenv');
require('dotenv').config({
  path:"./.env"
});


app.use(cors({ origin: (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map((origin) => origin.trim()), credentials: true }));
app.use(express.json());

app.get('/',(req,res)=>{
  res.send('Hello World!');
});

let users=[];

const addUser = (userId, socketId) => {
  userId = String(userId);

  // Remove an existing registration for this socket.
  users = users.filter((user) => user.socketId !== socketId);

  // Keep multiple active sockets for the same account.
  users.push({ userId, socketId });
};

const removeUser=(socketId)=>{
  users=users.filter((user)=>user.socketId!==socketId);
}

const getUser=(receiverId)=>{
  return users.find((user)=>user.userId===receiverId);
}

// Define a message object with a seen property
const createMessage=({senderId,receiverId,text,images})=>({
  senderId,
  receiverId,
  text,
  images,
  seen:false
}
)

io.use(authenticateSocket);

io.on('connection',(socket)=>{
  //when connected
  console.log('a user connected');

  //take userId and socketId 
  socket.on('addUser',(userId)=>{
    const accountId = String(userId);

    const authorized = socket.data.identities.some(
      identity => identity.id === accountId
    );

    if (!authorized) {
      socket.emit('authError', 'Unauthorized account');
      return;
    }

    addUser(accountId, socket.id);
    socket.join(accountId);
    io.emit('getUsers',users);
})

//send and get message
const messages={};   //object to track messages sent to each user
socket.on('sendMessage', async ({ senderId, receiverId, conversationId, messageId }) => {
  try {
    const authorized = await authorizeConversation(
      socket,
      conversationId,
      senderId,
      receiverId
    );

    if (!authorized || !mongoose.isValidObjectId(messageId)) {
      socket.emit('authError', 'Unauthorized message');
      return;
    }

    await connectDB();

    const savedMessage = await mongoose.connection.db
      .collection("messages")
      .findOne({
        _id: new mongoose.Types.ObjectId(messageId),
        conversationId: String(conversationId),
        sender: String(senderId)
      });

    if (!savedMessage) {
      socket.emit('authError', 'Message not found or unauthorized');
      return;
    }

    io.to(String(receiverId)).emit('getMessage', {
      messageId: String(savedMessage._id),
      conversationId: String(savedMessage.conversationId),
      senderId: String(savedMessage.sender),
      receiverId: String(receiverId),
      text: savedMessage.text,
      images: savedMessage.images || [],
      createdAt: savedMessage.createdAt,
      seen: false
    });
  } catch (error) {
    console.error('Socket message verification failed:', error.message);
    socket.emit('authError', 'Message verification failed');
  }
});

// Read receipts and last-message broadcasts are disabled until
// authenticated conversation-scoped handlers are implemented.

//when disconnect
socket.on('disconnect',()=>{
  console.log('a user disconnected');
  removeUser(socket.id);
  io.emit('getUsers',users);

})

})




if (require.main === module) {
  const port = process.env.PORT || 4000;

  server.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
}

module.exports = server;