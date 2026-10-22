import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { backend_url, server, socket_url } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import { format } from "timeago.js";
import socketIO from "socket.io-client";
import styles from "../../styles/styles";

const ENDPOINT = socket_url;

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);

  const [conversation, setConversation] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [open, setOpen] = useState(false);

  const socket = useRef();

  // ================= SOCKET INIT =================
  useEffect(() => {
    socket.current = socketIO(ENDPOINT, {
      transports: ["polling"],
    });

    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    socket.current.on("getUsers", (data) => {
      setOnlineUsers(data);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // ================= RECEIVE MESSAGE =================
  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // ================= GET CONVERSATIONS =================
  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
          { withCredentials: true }
        );
        setConversation(res.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };

    if (seller?._id) getConversation();
  }, [seller]);

  // ================= ADD USER TO SOCKET =================
  useEffect(() => {
    if (seller?._id && socket.current) {
      socket.current.emit("addUser", String(seller._id));
    }
  }, [seller]);

  // ================= ONLINE CHECK =================
  const onlineCheck = (chat) => {
    const chatMember = chat.members.find(
      (m) => String(m) !== String(seller?._id)
    );

    const online = onlineUsers.find(
      (u) => String(u.userId) === String(chatMember)
    );

    return !!online;
  };

  // ================= ACTIVE STATUS =================
  useEffect(() => {
    if (!userData?._id) return setActiveStatus(false);

    const isOnline = onlineUsers.some(
      (u) => String(u.userId) === String(userData._id)
    );

    setActiveStatus(isOnline);
  }, [onlineUsers, userData]);

  // ================= GET MESSAGES =================
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?._id) return;

      try {
        const res = await axios.get(
          `${server}/message/get-all-messages/${currentChat._id}`
        );
        setMessages(res.data.messages);
      } catch (error) {
        console.log(error);
      }
    };

    getMessages();
  }, [currentChat]);

  // ================= SEND MESSAGE =================
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (m) => m !== seller._id
    );

    socket.current.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        `${server}/message/create-new-message`,
        message
      );

      setMessages((prev) => [...prev, res.data.message]);

      await updateLastMessage();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= UPDATE LAST MESSAGE =================
  const updateLastMessage = async () => {
    socket.current.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    try {
      await axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: newMessage,
          lastMessageId: seller._id,
        }
      );

      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[90%] h-[85vh] bg-white m-5 overflow-y-scroll rounded">
      {!open ? (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>

          {conversation.map((item, index) => (
            <MessageList
              key={index}
              data={item}
              index={index}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              me={seller._id}
              setUserData={setUserData}
              online={onlineCheck(item)}
            />
          ))}
        </>
      ) : (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
        />
      )}
    </div>
  );
};

/* ================= MESSAGE LIST ================= */
const MessageList = ({
  data,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
}) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const userId = data.members.find((m) => m !== me);

      try {
        const res = await axios.get(
          `${server}/user/user-info/${userId}`,
          { withCredentials: true }
        );
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [data, me]);

  const handleClick = () => {
    setOpen(true);
    setCurrentChat(data);
    setUserData(user);
    navigate(`?chat=${data._id}`);
  };

  return (
    <div
      className="w-full flex px-3 p-3 cursor-pointer hover:bg-[#00000010]"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={`${backend_url}${user?.avatar}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />

        <div
          className={`w-[12px] h-[12px] rounded-full absolute top-[2px] right-[2px] ${
            online ? "bg-green-400" : "bg-gray-400"
          }`}
        />
      </div>

      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
      </div>
    </div>
  );
};

/* ================= SELLER INBOX ================= */
const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
}) => {
  return (
    <div className="w-full flex flex-col justify-between min-h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-slate-200 p-3">
        <div className="flex items-center">
          <img
            src={`${backend_url}${userData?.avatar}`}
            className="w-[60px] h-[60px] rounded-full"
            alt=""
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-semibold">
              {userData?.name}
            </h1>
            <p>{activeStatus ? "Active Now" : "Offline"}</p>
          </div>
        </div>

        <AiOutlineArrowRight
          size={22}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* MESSAGES */}
      <div className="px-3 h-[65vh] overflow-y-scroll">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex my-2 ${
              msg.sender === sellerId ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender !== sellerId && (
              <img
                src={`${backend_url}${userData?.avatar}`}
                className="w-[40px] h-[40px] rounded-full mr-2"
                alt=""
              />
            )}

            <div>
              <div className="p-2 bg-green-500 text-white rounded">
                {msg.text}
              </div>
              <p className="text-[12px] text-gray-600">
                {format(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <form
        onSubmit={sendMessageHandler}
        className="p-3 flex items-center"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={styles.input}
          placeholder="Enter message..."
        />

        <button type="submit">
          <AiOutlineSend size={22} />
        </button>
      </form>
    </div>
  );
};

export default DashboardMessages;