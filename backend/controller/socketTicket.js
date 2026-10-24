const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");
const { isConversationParticipant } = require("../middleware/auth");

const router = express.Router();

router.post("/ticket", isConversationParticipant, async (req, res) => {
  const identities = req.authenticatedMessageIds;

  if (!identities || identities.length === 0) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  if (!process.env.JWT_SECRET_KEY) {
    return res.status(500).json({
      success: false,
      message: "Socket authentication not configured"
    });
  }

  const verifiedIdentities = [];

  for (const id of identities) {
    if (await User.exists({ _id: id })) {
      verifiedIdentities.push({ role: "customer", id });
    }

    if (await Shop.exists({ _id: id })) {
      verifiedIdentities.push({ role: "seller", id });
    }
  }

  if (verifiedIdentities.length === 0) {
    return res.status(401).json({
      success: false,
      message: "No valid account found"
    });
  }

  const ticket = jwt.sign(
    {
      identities: verifiedIdentities,
      purpose: "socket-connect"
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30s",
      audience: "globalcart-socket",
      issuer: "globalcart-backend"
    }
  );

  return res.status(200).json({
    success: true,
    ticket
  });
});

module.exports = router;
