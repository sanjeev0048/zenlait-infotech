import mongoose from "mongoose";

const navbarLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
});

const footerLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
  section: { type: String, default: "General" }, // e.g. "Company", "Support"
  order: { type: Number, default: 0 },
});

const siteSettingsSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: "Zenelait" },
    logoUrl: { type: String, default: "" },

    navbarLinks: [navbarLinkSchema],
    footerLinks: [footerLinkSchema],
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;
