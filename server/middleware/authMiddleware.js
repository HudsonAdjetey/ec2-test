const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const UserModel = require("../model/userModel");

const protectedRoute = asyncHandler(async (req, res, next) => {
  // get the refresh token from the cookie
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ error: "Not authorized, no token found" });
  }
  // verify the token and assign a new token by decoding
  // the payload

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if there's a valid user ID in the decoded payload
    if (decoded && decoded.id) {
      const accessToken = jwt.sign(
        { access_token: decoded.id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );

      //   set a new cookie
      // with the new access token
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 1 * 60 * 60 * 1000, //(1hr)
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "strict",
      });

      req.user = await UserModel.findById(decoded.id).select("-password");
      next();
    } else {
      return res.status(401).json({ error: "Access token is invalid" });
    }
  } catch (error) {
    console.log("error", error.message);
    return res.status(401).json({ error: "Access token is invalid" });
  }
});

module.exports = protectedRoute;
