import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import { createAuthenticatedSocket } from "../utils/createAuthenticatedSocket";
import { format } from "timeago.js";
import { backend_url, server } from "../server";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";
import { getImageUrl } from "../utils/getImageUrl";

const messagingAxios = axios.create({ withCredentials: true });

const UserInbox = () => {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = createAuthenticatedSocket();
  }

  const socketId = socketRef.current;
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (loading || !user?._id) {
      socketId.disconnect();
      return;
    }

    const handleConnectionError = (error) => {
      console.error("Customer socket connection failed:", error.message);
    };

    socketId.on("connect_error", handleConnectionError);
    socketId.connect();

    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        _id: data.messageId,
        conversationId: data.conversationId,
        sender: data.senderId,
        text: data.text,
        images: data.images || [],
        createdAt: data.createdAt || Date.now(),
      });
    });

    return () => {
      socketId.off("getMessage");
      socketId.off("connect_error", handleConnectionError);
      socketId.disconnect();
    };
  }, [loading, user?._id, socketId]);

  useEffect(() => {
    if (
      !arrivalMessage?._id ||
      String(arrivalMessage.conversationId) !== String(currentChat?._id) ||
      !currentChat?.members.some(
        (member) => String(member) === String(arrivalMessage.sender)
      )
    ) {
      return;
    }

    setMessages((prev) => {
      const alreadyExists = prev.some(
        (message) => String(message._id) === String(arrivalMessage._id)
      );

      return alreadyExists ? prev : [...prev, arrivalMessage];
    });
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const resonse = await messagingAxios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          },
        );

        setConversations(resonse.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (id && conversations.length > 0) {
      const chat = conversations.find((conversation) => conversation._id === id);
      if (chat) {
        setCurrentChat(chat);
        setOpen(true);
      }
    }
  }, [id, conversations]);

  useEffect(() => {
    const loadChatUser = async () => {
      if (!currentChat) return;
      const userId = currentChat.members.find((member) => member !== user?._id);
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUserData(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    loadChatUser();
  }, [currentChat, user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    const joinRoom = () => {
      socketId.emit("addUser", String(user._id));
    };

    const handleUsers = (data) => {
      setOnlineUsers(data);
    };

    socketId.on("connect", joinRoom);
    socketId.on("getUsers", handleUsers);

    if (socketId.connected) joinRoom();

    return () => {
      socketId.off("connect", joinRoom);
      socketId.off("getUsers", handleUsers);
    };
  }, [user?._id]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find(
      (member) => String(member) !== String(user?._id),
    );
    const online = onlineUsers.find(
      (onlineUser) => String(onlineUser.userId) === String(chatMembers),
    );

    return online ? true : false;
  };

  useEffect(() => {
    if (!userData?._id) {
      setActiveStatus(false);
      return;
    }

    const isOnline = onlineUsers.some(
      (onlineUser) => String(onlineUser.userId) === String(userData._id),
    );
    setActiveStatus(isOnline);
  }, [onlineUsers, userData]);

  // Recover saved messages after connecting or reconnecting.
  useEffect(() => {
    const conversationId = currentChat?._id;
    if (!conversationId || !user?._id) return;

    const controller = new AbortController();
    const currentSocket = socketId;

    const syncMessages = async () => {
      try {
        const response = await messagingAxios.get(
          `${server}/message/get-all-messages/${conversationId}`,
          { signal: controller.signal }
        );

        if (controller.signal.aborted) return;

        const fetched = (response.data.messages || []).filter(
          (message) =>
            String(message.conversationId) === String(conversationId)
        );

        setMessages((previous) => {
          const merged = new Map();

          for (const message of [
            ...previous.filter(
              (item) =>
                String(item.conversationId) === String(conversationId)
            ),
            ...fetched
          ]) {
            if (message._id) {
              merged.set(String(message._id), message);
            }
          }

          return [...merged.values()].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Message synchronization failed:", error);
        }
      }
    };

    currentSocket.on("connect", syncMessages);

    if (currentSocket.connected) syncMessages();

    return () => {
      controller.abort();
      currentSocket.off("connect", syncMessages);
    };
  }, [currentChat?._id, user?._id, socketId]);

  // Load only messages belonging to the selected conversation.
  useEffect(() => {
    const conversationId = currentChat?._id;
    const controller = new AbortController();

    setMessages([]);

    if (!conversationId) {
      return () => controller.abort();
    }

    const loadMessages = async () => {
      try {
        const response = await messagingAxios.get(
          `${server}/message/get-all-messages/${conversationId}`,
          { signal: controller.signal }
        );

        if (controller.signal.aborted) return;

        const fetched = (response.data.messages || []).filter(
          (message) =>
            String(message.conversationId) === String(conversationId)
        );

        setMessages((previous) => {
          const merged = new Map();

          for (const message of [
            ...previous.filter(
              (item) =>
                String(item.conversationId) === String(conversationId)
            ),
            ...fetched,
          ]) {
            if (message._id) {
              merged.set(String(message._id), message);
            }
          }

          return [...merged.values()].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load conversation messages:", error);
        }
      }
    };

    loadMessages();

    return () => controller.abort();
  }, [currentChat?._id]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user?._id,
    );

    try {
      if (newMessage !== "") {
        await messagingAxios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);

            socketId.emit("sendMessage", {
              senderId: user?._id,
              receiverId,
              conversationId: currentChat._id,
              messageId: res.data.message._id,
            });

            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });

    await messagingAxios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentChat?._id) return;

    await imageSendingHandler(file);
    e.target.value = "";
  };

  const imageSendingHandler = async (file) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("conversationId", currentChat._id);
    formData.append("sender", String(user._id));
    formData.append("text", "");

    try {
      const res = await messagingAxios.post(
        `${server}/message/create-new-message`,
        formData
      );

      const savedMessage = res.data.message;

      setMessages((prev) => [...prev, savedMessage]);

      const receiverId = currentChat.members.find(
        (member) => String(member) !== String(user._id)
      );

      socketId.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        conversationId: currentChat._id,
        messageId: savedMessage._id,
      });

      setImages(null);
      updateLastMessageForImage();
    } catch (error) {
      console.error("Image message failed:", error);
      alert("Failed to send image. Please try again.");
    }
  };


  const updateLastMessageForImage = async () => {
    await messagingAxios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: user._id,
      },
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="w-full">
      {!open && (
        <>
          <Header />
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {/* All messages list */}
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user?._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                loading={loading}
              />
            ))}
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
          onClose={() => {
            setOpen(false);
            setCurrentChat(undefined);
            navigate("/inbox", { replace: true });
          }}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  loading,
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      }  cursor-pointer`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user)
      }
    >
      <div className="relative">
        <img
          src={getImageUrl(user?.avatar)}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {!loading && data?.lastMessageId !== userData?._id
            ? "You:"
            : (userData?.name?.split(" ")[0] || "") + ": "}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
  onClose,
}) => {
  const getMessageImageSrc = (images) => {
    const imageValue = Array.isArray(images) ? images[0] : images;
    if (!imageValue) return "";

    if (typeof imageValue === "string") {
      if (imageValue.startsWith("http") || imageValue.startsWith("data:")) {
        return imageValue;
      }
            return getImageUrl(imageValue);
    }

    if (typeof imageValue === "object" && imageValue.url) {
      return imageValue.url;
    }

    return "";
  };

  return (
    <div className="w-[full] min-h-full flex flex-col justify-between p-5">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={getImageUrl(userData?.avatar)}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={onClose}
        />
      </div>

      {/* messages */}
      <div className="px-3 h-[75vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => (
            <div
              className={`flex w-full my-2 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
              ref={scrollRef}
            >
              {item.sender !== sellerId && (
                <img
                  src={getImageUrl(userData?.avatar)}
                  className="w-[40px] h-[40px] rounded-full mr-3"
                  alt=""
                />
              )}
              {getMessageImageSrc(item.images) && (
                <img
                  src={getMessageImageSrc(item.images)}
                  className="w-[300px] h-[300px] object-cover rounded-[10px] ml-2 mb-2"
                  alt="chat attachment"
                />
              )}
              {item.text !== "" && (
                <div>
                  <div
                    className={`w-max p-2 rounded ${
                      item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
                    } text-[#fff] h-min`}
                  >
                    <p>{item.text}</p>
                  </div>

                  <p className="text-[12px] text-[#000000d3] pt-1">
                    {format(item.createdAt)}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* send message input */}
      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserInbox;
