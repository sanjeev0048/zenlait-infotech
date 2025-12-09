import express from "express";
import SiteSettings from "../models/SiteSettings.js";

const router = express.Router();

// Helper: ensure there is always one settings document
const getOrCreateSettings = async () => {
  let doc = await SiteSettings.findOne();
  if (!doc) {
    doc = await SiteSettings.create({
      brandName: "Zenelait",
      logoUrl: "",
      navbarLinks: [
        { label: "Home", path: "/", order: 1 },
        { label: "About", path: "/about", order: 2 },
        { label: "Products", path: "/products", order: 3 },
        { label: "Services", path: "/service", order: 4 },
        { label: "Contact", path: "/contact", order: 5 },
      ],
      footerLinks: [],
    });
  }
  return doc;
};

// GET /settings  → used by Admin
router.get("/", async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    console.error("Settings GET error", err);
    res.status(500).json({ error: "Failed to load settings" });
  }
});

// PUT /settings  → used by Admin to save
router.put("/", async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const { brandName, logoUrl, navbarLinks, footerLinks } = req.body;

    if (brandName !== undefined) settings.brandName = brandName;
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;
    if (navbarLinks !== undefined) settings.navbarLinks = navbarLinks;
    if (footerLinks !== undefined) settings.footerLinks = footerLinks;

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error("Settings PUT error", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
