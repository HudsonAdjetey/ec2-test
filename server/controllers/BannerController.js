const asyncHandler = require("express-async-handler");
const UserModel = require("../model/userModel");
const BannerModel = require("../model/bannerModel");
// const add Banner url

/* BANNER URL */
const bannerURL = asyncHandler(async (req, res) => {
  let data = req.body.bannerURL;

  // Check for the user as an "Admin"
  const checkAdmin = await UserModel.findOne({
    _id: req.user.id,
    role: "Admin",
  });
  if (!checkAdmin) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }

  // Check if a banner exists
  const existingBanner = await BannerModel.findOne();

  if (!existingBanner) {
    // Create a new banner if none exists
    const newBannerURL = new BannerModel({ url: req.body.bannerURL });
    const createdBanner = await newBannerURL.save();
    return res.status(201).json({
      success: true,
      message: "Success",
    });
  }

  // Update the existing banner
  try {
    const updatedBanner = await BannerModel.updateMany(
      {},
      { $set: { url: data } }
    );
    res.status(200).json({
      success: true,
      count: updatedBanner.nModified,
      message: "URL has been updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update URL.",
    });
  }
});
/* BANNER URL */

/* BANNER URL == GET METHOD */
const fetchUrl = asyncHandler(async (req, res) => {
  const banner = await BannerModel.findOne();
  if (!banner) {
    return res
      .status(404)
      .json({ success: false, message: "No banner found." });
  }
  res.status(200).json({
    success: true,
    data: banner.url,
  });
});
/* BANNER URL == GET METHOD */

module.exports = {
  bannerURL,
  fetchUrl,
};
