const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const connectDB = require("./db");

async function authenticateSocket(socket, next) {
  try {
    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
      return next(new Error("Socket authentication not configured"));
    }

    const { parseCookie } = await import("cookie");
    // Production: authenticate using a short-lived socket ticket.
    const ticket = socket.handshake.auth?.ticket;

    if (ticket) {
      let decoded;

      try {
        decoded = jwt.verify(ticket, secret, {
          audience: "globalcart-socket",
          issuer: "globalcart-backend",
          algorithms: ["HS256"]
        });
      } catch {
        return next(new Error("Invalid or expired socket ticket"));
      }

      if (
        decoded.purpose !== "socket-connect" ||
        !Array.isArray(decoded.identities) ||
        decoded.identities.length === 0
      ) {
        return next(new Error("Invalid socket ticket"));
      }

      await connectDB();

      const verified = [];

      for (const identity of decoded.identities) {
        if (
          !identity ||
          typeof identity.id !== "string" ||
          !mongoose.isValidObjectId(identity.id) ||
          !["customer", "seller"].includes(identity.role)
        ) {
          continue;
        }

        const collection =
          identity.role === "seller" ? "shops" : "users";

        const exists = await mongoose.connection.db
          .collection(collection)
          .findOne(
            { _id: new mongoose.Types.ObjectId(identity.id) },
            { projection: { _id: 1 } }
          );

        if (exists) {
          verified.push({
            role: identity.role,
            id: identity.id
          });
        }
      }

      if (verified.length === 0) {
        return next(new Error("Socket account not found"));
      }

      socket.data.identities = verified;
      return next();
    }

    // Production connections must use short-lived socket tickets.
    if (process.env.NODE_ENV === "production") {
      return next(new Error("Socket ticket required"));
    }

    const cookies = parseCookie(
      socket.handshake.headers.cookie || ""
    );

    const token = cookies.token;
    const sellerToken = cookies.seller_token;

    if (!token && !sellerToken) {
      return next(new Error("Authentication required"));
    }

    const identities = [];

    for (const [role, value] of [
      ["customer", token],
      ["seller", sellerToken],
    ]) {
      if (!value) continue;

      try {
        const decoded = jwt.verify(value, secret);

        if (decoded.id) {
          identities.push({
            role,
            id: String(decoded.id),
          });
        }
      } catch {
        // Ignore an expired or invalid cookie.
      }
    }

    if (identities.length === 0) {
      return next(new Error("Invalid or expired session"));
    }

    await connectDB();

    const verified = [];

    for (const identity of identities) {
      if (!mongoose.isValidObjectId(identity.id)) continue;

      const collection = identity.role === "seller" ? "shops" : "users";

      const exists = await mongoose.connection.db
        .collection(collection)
        .findOne(
          { _id: new mongoose.Types.ObjectId(identity.id) },
          { projection: { _id: 1 } }
        );

      if (exists) verified.push(identity);
    }

    if (verified.length === 0) {
      return next(new Error("Account not found"));
    }

    socket.data.identities = verified;
    next();
  } catch {
    next(new Error("Socket authentication failed"));
  }
}

module.exports = authenticateSocket;
