import axios from "axios";
import { io } from "socket.io-client";
import { server, socket_url, socket_path } from "../server";

const ticketClient = axios.create({
  withCredentials: true,
});

export const createAuthenticatedSocket = () => {
  const socket = io(socket_url, {
    autoConnect: false,
    path: socket_path,
    addTrailingSlash: false,
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.auth = async (callback) => {
    try {
      const response = await ticketClient.post(
        `${server}/socket/ticket`,
        {}
      );

      if (!response.data?.ticket) {
        throw new Error("Backend did not issue a socket ticket");
      }

      callback({ ticket: response.data.ticket });
    } catch (error) {
      console.error(
        "Socket authentication failed:",
        error.response?.status || error.message
      );

      callback({ ticket: "" });
    }
  };

  return socket;
};
