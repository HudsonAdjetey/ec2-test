const jwt = require("jsonwebtoken");

const generateAccessToken = (res, userID) => {
  let token = jwt.sign({ id: userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  console.log(token);
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production" ? true : false,
    sameSite: "None",
    maxAge: 1 * 60 * 60 * 1000, //(1hr)
  });
};

const generateRefreshToken = (res, userID) => {
  let refreshToken = jwt.sign(
    { id: userID },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000, //(30days)
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
