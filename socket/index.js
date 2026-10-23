
const socketIO=require('socket.io');
const http=require('http');
const express=require('express');
const cors=require('cors');
const app=express();
const server=http.createServer(app);
const io=socketIO(server, { cors: { origin: (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map((origin) => origin.trim()), credentials: true } })
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

io.on('connection',(socket)=>{
  //when connected
  console.log('a user connected');

  //take userId and socketId 
  socket.on('addUser',(userId)=>{
    addUser(userId,socket.id);
    socket.join(String(userId));
    io.emit('getUsers',users);
})

//send and get message
const messages={};   //object to track messages sent to each user
socket.on('sendMessage',({senderId,receiverId,text,images})=>{
  const message=createMessage({senderId,receiverId,text,images});
  const user=getUser(receiverId)

  //store the message in the messages object
  if(!messages[receiverId]){
    messages[receiverId]=[message];
  }else{
    messages[receiverId].push(message);

  }

  //send the message to the receiver
  io.to(String(receiverId)).emit('getMessage',message);

})
socket.on('messageSeen',({senderId,receiverId})=>{
  const user=getUser(senderId);

  //update the seen flag to the message 
  if(messages[senderId]){
    const message=messages[senderId].find((message)=>message.receiverId===receiverId && message.id===messageId);
    if(message){
      message.seen=true;

      //send a message seen event to the sender
      io.to(user?.socketId).emit('messageSeen',{
        senderId,
        receiverId,  
        messageId
      });
    }
    
  }
})

//update and get a last message 
socket.on('updateLastMessage',({lastMessage,lastMessageId})=>{
  io.emit('getLastMessage',{lastMessage,lastMessageId});


})


//when disconnect
socket.on('disconnect',()=>{
  console.log('a user disconnected');
  removeUser(socket.id);
  io.emit('getUsers',users);

})

})




server.listen(process.env.PORT || 4000,()=>{
  console.log(`server is running on port ${process.env.PORT ||4000}`);
  
})