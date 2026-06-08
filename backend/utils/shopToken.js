const sendShopToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
    sameSite: "lax", // important for cross-origin (use 'none' if using HTTPS)
    secure: false, // keep false for localhost, true in production (HTTPS)
  };

  res
    .status(statusCode)
    .cookie("seller_token", token, options)
    .json({
      success: true,
      user,
      token,
    });
};

module.exports = sendShopToken;
