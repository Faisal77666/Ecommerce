const isLocalhost = ["localhost", "127.0.0.1"].includes(
  window.location.hostname
);

const apiOrigin = isLocalhost
  ? (process.env.REACT_APP_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "")
  : "";

export const server = `${apiOrigin}/api/v2`;

export const backend_url = isLocalhost
  ? `${apiOrigin}/`
  : "/";

export const socket_url = (
  process.env.REACT_APP_SOCKET_URL ||
  (isLocalhost
    ? "http://localhost:4000"
    : "https://globalcart-socket.vercel.app")
).replace(/\/+$/, "");

export const socket_path = "/api/socket";
