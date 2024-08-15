const { default: mongoose } = require("mongoose");

const bannerURL = new mongoose.Schema({
  url: { type: String, required: true },
});

const BannerModel =
  mongoose.model.banner || mongoose.model("banner", bannerURL);

module.exports = BannerModel;
