import React, { useState, useEffect } from "react";
import {
  Menu,
  Home as HomeIcon,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Eye,
  Phone,
  Mail,
  Clock,
  MapPin,
  Search,
  RefreshCw,
} from "lucide-react";

// Backend base URL
const API_BASE_URL = "http://localhost:5000";

// Simple rich-text looking textarea reused everywhere
function RichTextEditor({ value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 text-xs text-slate-500">
        <button className="px-1.5 py-0.5 rounded hover:bg-slate-100 font-semibold">
          B
        </button>
        <button className="px-1.5 py-0.5 rounded hover:bg-slate-100 italic">
          I
        </button>
        <button className="px-1.5 py-0.5 rounded hover:bg-slate-100 underline">
          U
        </button>
        <span className="h-4 w-px bg-slate-200 mx-1" />
        <span className="text-[11px]">Align</span>
        <span className="ml-auto text-[11px]">Aa</span>
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border-0 outline-none resize-y min-h-[80px]"
      />
    </div>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("navbar");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ----- DATA STATES -----

  const [navLinks, setNavLinks] = useState([
    { id: 1, label: "Home", path: "/", active: true },
    { id: 2, label: "About", path: "/about", active: true },
    { id: 3, label: "Products", path: "/products", active: true },
    { id: 4, label: "Services", path: "/service", active: true }, // match /service route
    { id: 5, label: "Blog", path: "/blog", active: true },
    { id: 6, label: "Contact", path: "/contact", active: true },
  ]);

  const [homeContent, setHomeContent] = useState({
    heroTitle:
      "Professional Software Company in Chennai for ERP, LMS, CRM & SaaS",
    heroDescription: "",
    heroImageUrl: "",
    primaryCtaText: "Get Started →",
    secondaryCtaText: "Explore Services",
  });

  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    duration: "",
    owner: "",
    price: "",
  });

  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    clientName: "",
    projectName: "",
    stack: "",
    result: "",
  });

  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "How ERP & CRM Transform Growing Businesses",
      excerpt:
        "Understand how integrated ERP and CRM systems streamline operations, sales, and customer experience for SMEs.",
      tags: ["ERP", "CRM", "business"],
      category: "Business",
      status: "Published",
      date: "11/29/2025",
    },
    {
      id: 2,
      title: "Top 5 Reasons to Move Your SaaS Product to the Cloud",
      excerpt:
        "A quick look at how cloud-native SaaS improves security, scalability, and performance for modern products.",
      tags: ["SaaS", "Cloud", "technology"],
      category: "Technology",
      status: "Published",
      date: "11/29/2025",
    },
  ]);

  const [trustStats, setTrustStats] = useState({
    clientCount: "150+",
    clientLabel: "Businesses Served",
    platforms: [
      { id: 1, name: "Google Reviews", rating: "4.9" },
      { id: 2, name: "Clutch", rating: "4.8" },
    ],
  });

  const [contactInfo, setContactInfo] = useState({
    companyName: "Zenelait Infotech",
    addressLine1: "Y Block 1st Street",
    area: "Anna Nagar",
    city: "Chennai",
    pincode: "600040",
    country: "India",
    mainPhone: "+91 9884264816",
    supportPhone: "+91 98765 43210",
    infoEmail: "zenelaitinfotech@gmail.com",
    salesEmail: "sales@zenelait.com",
    supportEmail: "support@zenelait.com",
  });

  const [aboutPage, setAboutPage] = useState({
    title: "About Zenelait Infotech",
    heroImageUrl: "",
    description:
      "Zenelait Infotech is a trusted software company in Anna Nagar, Chennai, offering ERP, LMS, CRM & SaaS solutions for modern businesses.",
  });

  const [footerContent, setFooterContent] = useState({
    description:
      "Zenelait Infotech is a professional software company in Chennai specialising in ERP, LMS, CRM and custom SaaS solutions. We build scalable, secure and high-performance applications for growing businesses.",
    copyright: "© 2025 Zenelait Infotech. All rights reserved.",
  });

  // Enquiries
  const [contacts, setContacts] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState("");

  const adminTabs = [
    { id: "navbar", label: "Navbar", icon: Menu },
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FileText },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "trust", label: "Trust Stats", icon: Star },
    { id: "contactInfo", label: "Contact", icon: MessageSquare },
    { id: "about", label: "About", icon: FileText },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare },
    { id: "footer", label: "Footer", icon: Settings },
  ];

  // -------- ENQUIRIES FETCH --------
  // -------- ENQUIRIES FETCH --------
const fetchContacts = async () => {
  setLoadingEnquiries(true);
  setEnquiriesError("");

  try {
    const token = localStorage.getItem("adminToken");

    const res = await fetch("http://localhost:5000/api/contacts", {
      headers: {
        Authorization: `Bearer ${token}`,
  },
});

    if (!res.ok) {
      throw new Error("Failed to fetch enquiries");
    }

    const data = await res.json();
    console.log("Enquiries Backend:", data);

    setContacts(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Enquiry fetch error:", err);
    setEnquiriesError("Unable to load enquiries. Try again later.");
  } finally {
    setLoadingEnquiries(false);
  }
};


  useEffect(() => {
    if (activeTab === "enquiries") {
      fetchContacts();
      const interval = setInterval(fetchContacts, 15000); // every 15s
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // -------- HANDLERS --------

  const handleSave = (section) => {
    console.log(`Saving section: ${section}`);
    alert(`Saved ${section} settings (connect to API later).`);
  };

  const handleAddService = () => {
    if (!newService.title) return;
    setServices((prev) => [
      ...prev,
      { ...newService, id: Date.now().toString() },
    ]);
    setNewService({
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      duration: "",
      owner: "",
      price: "",
    });
  };

  const handleAddProject = () => {
    if (!newProject.clientName || !newProject.projectName) return;
    setProjects((prev) => [
      ...prev,
      { ...newProject, id: Date.now().toString() },
    ]);
    setNewProject({
      clientName: "",
      projectName: "",
      stack: "",
      result: "",
    });
  };

  const handleAddPlatform = () => {
    setTrustStats((prev) => ({
      ...prev,
      platforms: [
        ...prev.platforms,
        { id: Date.now(), name: "", rating: "" },
      ],
    }));
  };

  const handleDeletePlatform = (id) => {
    setTrustStats((prev) => ({
      ...prev,
      platforms: prev.platforms.filter((p) => p.id !== id),
    }));
  };

  // -------- RENDER SECTIONS --------

  const renderNavbarSettings = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Navbar / Header
          </h2>
          <p className="text-sm text-slate-500">
            Manage navigation menu and header.
          </p>
        </div>
        <button
          onClick={() => handleSave("Navbar")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Logo</h3>
          <p className="text-sm text-slate-500 mb-3">
            Upload your website logo.
          </p>
          <button className="w-full md:w-72 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
            <Upload size={18} />
            Upload Logo
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Navigation Links
            </h3>
            <button
              onClick={() =>
                setNavLinks((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    label: "New Link",
                    path: "/new-link",
                    active: true,
                  },
                ])
              }
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Plus size={14} />
              Add Link
            </button>
          </div>

          <div className="space-y-3">
            {navLinks.map((link, idx) => (
              <div
                key={link.id}
                className="flex flex-col md:flex-row md:items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/60"
              >
                <div className="flex items-center gap-2 text-slate-400 text-xs md:w-20">
                  <span className="cursor-grab">⋮⋮</span>
                  <span className="font-medium">#{idx + 1}</span>
                </div>
                <input
                  value={link.label}
                  onChange={(e) =>
                    setNavLinks((prev) =>
                      prev.map((l) =>
                        l.id === link.id ? { ...l, label: e.target.value } : l
                      )
                    )
                  }
                  className="flex-1 px-3 py-1.5 rounded border border-slate-200 text-sm"
                />
                <input
                  value={link.path}
                  onChange={(e) =>
                    setNavLinks((prev) =>
                      prev.map((l) =>
                        l.id === link.id ? { ...l, path: e.target.value } : l
                      )
                    )
                  }
                  className="flex-1 px-3 py-1.5 rounded border border-slate-200 text-sm"
                />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    <span>Active</span>
                    <button
                      type="button"
                      onClick={() =>
                        setNavLinks((prev) =>
                          prev.map((l) =>
                            l.id === link.id
                              ? { ...l, active: !l.active }
                              : l
                          )
                        )
                      }
                      className={`w-10 h-5 rounded-full flex items-center transition ${
                        link.active
                          ? "bg-red-600 justify-end"
                          : "bg-slate-300 justify-start"
                      }`}
                    >
                      <span className="w-4 h-4 bg-white rounded-full shadow" />
                    </button>
                  </label>
                  <button
                    onClick={() =>
                      setNavLinks((prev) =>
                        prev.filter((l) => l.id !== link.id)
                      )
                    }
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderHomeContent = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Home Page Content
          </h2>
          <p className="text-sm text-slate-500">
            Manage hero section, stats, and CTA.
          </p>
        </div>
        <button
          onClick={() => handleSave("Home")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Hero Section
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Hero Title
            </label>
            <RichTextEditor
              value={homeContent.heroTitle}
              onChange={(v) =>
                setHomeContent((prev) => ({ ...prev, heroTitle: v }))
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Hero Description
            </label>
            <RichTextEditor
              rows={5}
              value={homeContent.heroDescription}
              onChange={(v) =>
                setHomeContent((prev) => ({ ...prev, heroDescription: v }))
              }
              placeholder="Short paragraph describing your software company..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Hero Image URL
              </label>
              <input
                type="text"
                value={homeContent.heroImageUrl}
                onChange={(e) =>
                  setHomeContent((prev) => ({
                    ...prev,
                    heroImageUrl: e.target.value,
                  }))
                }
                placeholder="Enter hero image URL"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-end gap-3">
              <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 border border-dashed border-slate-300 w-full md:w-60">
                <Upload size={16} />
                Upload Hero Image
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Primary CTA Text
              </label>
              <input
                type="text"
                value={homeContent.primaryCtaText}
                onChange={(e) =>
                  setHomeContent((prev) => ({
                    ...prev,
                    primaryCtaText: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Secondary CTA Text
              </label>
              <input
                type="text"
                value={homeContent.secondaryCtaText}
                onChange={(e) =>
                  setHomeContent((prev) => ({
                    ...prev,
                    secondaryCtaText: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderServices = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Services</h2>
          <p className="text-sm text-slate-500">
            Create and manage software services (ERP, CRM, LMS, SaaS, etc.).
          </p>
        </div>
        <button
          onClick={() => handleSave("Services")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Add New Service
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Service Title
              </label>
              <input
                type="text"
                value={newService.title}
                onChange={(e) =>
                  setNewService((p) => ({ ...p, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Slug (URL-friendly)
              </label>
              <input
                type="text"
                value={newService.slug}
                onChange={(e) =>
                  setNewService((p) => ({ ...p, slug: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Full Description
            </label>
            <RichTextEditor
              rows={5}
              value={newService.description}
              onChange={(v) =>
                setNewService((p) => ({ ...p, description: v }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Short Description (for service cards)
              </label>
              <input
                type="text"
                value={newService.shortDescription}
                onChange={(e) =>
                  setNewService((p) => ({
                    ...p,
                    shortDescription: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Estimated Timeline (optional)
              </label>
              <input
                type="text"
                value={newService.duration}
                onChange={(e) =>
                  setNewService((p) => ({ ...p, duration: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Owner / Team
              </label>
              <input
                type="text"
                value={newService.owner}
                onChange={(e) =>
                  setNewService((p) => ({ ...p, owner: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Starting Price (optional)
              </label>
              <input
                type="text"
                value={newService.price}
                onChange={(e) =>
                  setNewService((p) => ({ ...p, price: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              <Plus size={16} />
              Add Service
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Services List
          </h3>
          {services.length === 0 ? (
            <p className="text-sm text-slate-500">
              No services added yet. Use the form above to create one.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white"
                >
                  <div className="h-32 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                    <Briefcase className="text-white" size={36} />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-slate-900 line-clamp-1">
                      {service.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {service.shortDescription || "No short description."}
                    </p>
                    <p className="text-xs text-slate-500">
                      Timeline:{" "}
                      <span className="font-medium">
                        {service.duration || "N/A"}
                      </span>
                    </p>
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700">
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setServices((prev) =>
                            prev.filter((s) => s.id !== service.id)
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderProjects = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Projects</h2>
          <p className="text-sm text-slate-500">
            Add client projects / case studies and manage them.
          </p>
        </div>
        <button
          onClick={() => handleSave("Projects")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Add New Project
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={newProject.clientName}
                onChange={(e) =>
                  setNewProject((p) => ({
                    ...p,
                    clientName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={newProject.projectName}
                onChange={(e) =>
                  setNewProject((p) => ({
                    ...p,
                    projectName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tech Stack
              </label>
              <input
                type="text"
                value={newProject.stack}
                onChange={(e) =>
                  setNewProject((p) => ({ ...p, stack: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Result / Outcome
              </label>
              <input
                type="text"
                value={newProject.result}
                onChange={(e) =>
                  setNewProject((p) => ({ ...p, result: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={handleAddProject}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Projects List
          </h3>
          {projects.length === 0 ? (
            <p className="text-sm text-slate-500">
              No projects added yet. Add a project above.
            </p>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/60"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {p.projectName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Client: {p.clientName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Stack: {p.stack || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Result: {p.result || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-slate-100 text-red-600 hover:bg-red-50">
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-slate-100 text-red-500 hover:bg-red-50"
                      onClick={() =>
                        setProjects((prev) =>
                          prev.filter((pl) => pl.id !== p.id)
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderBlog = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Blog Posts</h2>
          <p className="text-sm text-slate-500">
            Manage your website blog posts.
          </p>
        </div>
        <button
          onClick={() => handleSave("Blog")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
          <Plus size={16} />
          Add New Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="h-40 bg-slate-200" />
            <div className="p-5 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold px-2 py-0.5">
                  {post.status}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5">
                  {post.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {post.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                By Zenelait Team • {post.date}
              </p>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700">
                  Edit
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">
                  <Eye size={14} />
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-red-500 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderTrustStats = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Trust Statistics
          </h2>
          <p className="text-sm text-slate-500">
            Manage the trust indicators displayed on the homepage.
          </p>
        </div>
        <button
          onClick={() => handleSave("Trust Stats")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Client Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Client Count
              </label>
              <input
                type="text"
                value={trustStats.clientCount}
                onChange={(e) =>
                  setTrustStats((p) => ({
                    ...p,
                    clientCount: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                This will display as: &quot;Trusted by {trustStats.clientCount}{" "}
                Businesses&quot;
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Client Label
              </label>
              <input
                type="text"
                value={trustStats.clientLabel}
                onChange={(e) =>
                  setTrustStats((p) => ({
                    ...p,
                    clientLabel: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Rating Platforms
            </h3>
            <button
              onClick={handleAddPlatform}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Plus size={14} />
              Add Platform
            </button>
          </div>

          <div className="space-y-3">
            {trustStats.platforms.map((platform) => (
              <div
                key={platform.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-slate-200 rounded-lg px-3 py-3 bg-slate-50/60"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={platform.name}
                    onChange={(e) =>
                      setTrustStats((prev) => ({
                        ...prev,
                        platforms: prev.platforms.map((p) =>
                          p.id === platform.id
                            ? { ...p, name: e.target.value }
                            : p
                        ),
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Rating (0–5)
                  </label>
                  <input
                    type="text"
                    value={platform.rating}
                    onChange={(e) =>
                      setTrustStats((prev) => ({
                        ...prev,
                        platforms: prev.platforms.map((p) =>
                          p.id === platform.id
                            ? { ...p, rating: e.target.value }
                            : p
                        ),
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="flex items-end justify-end">
                  <button
                    onClick={() => handleDeletePlatform(platform.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-red-500 hover:bg-red-50 text-xs"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderContactInfo = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Contact Information
          </h2>
          <p className="text-sm text-slate-500">
            Update your company address, phone numbers and emails.
          </p>
        </div>
        <button
          onClick={() => handleSave("Contact Info")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={contactInfo.companyName}
              onChange={(e) =>
                setContactInfo((p) => ({
                  ...p,
                  companyName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Area
            </label>
            <input
              type="text"
              value={contactInfo.area}
              onChange={(e) =>
                setContactInfo((p) => ({ ...p, area: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              City
            </label>
            <input
              type="text"
              value={contactInfo.city}
              onChange={(e) =>
                setContactInfo((p) => ({ ...p, city: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Address Line
            </label>
            <input
              type="text"
              value={contactInfo.addressLine1}
              onChange={(e) =>
                setContactInfo((p) => ({
                  ...p,
                  addressLine1: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Pincode
            </label>
            <input
              type="text"
              value={contactInfo.pincode}
              onChange={(e) =>
                setContactInfo((p) => ({ ...p, pincode: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Country
            </label>
            <input
              type="text"
              value={contactInfo.country}
              onChange={(e) =>
                setContactInfo((p) => ({ ...p, country: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Phone Numbers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Main
              </label>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                <input
                  type="text"
                  value={contactInfo.mainPhone}
                  onChange={(e) =>
                    setContactInfo((p) => ({
                      ...p,
                      mainPhone: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Support
              </label>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                <input
                  type="text"
                  value={contactInfo.supportPhone}
                  onChange={(e) =>
                    setContactInfo((p) => ({
                      ...p,
                      supportPhone: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Email Addresses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Info
              </label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                <input
                  type="email"
                  value={contactInfo.infoEmail}
                  onChange={(e) =>
                    setContactInfo((p) => ({
                      ...p,
                      infoEmail: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Sales
              </label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                <input
                  type="email"
                  value={contactInfo.salesEmail}
                  onChange={(e) =>
                    setContactInfo((p) => ({
                      ...p,
                      salesEmail: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Support
              </label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                <input
                  type="email"
                  value={contactInfo.supportEmail}
                  onChange={(e) =>
                    setContactInfo((p) => ({
                      ...p,
                      supportEmail: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Office Hours (display-only example)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>Monday – Friday: 9:00 AM – 7:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>Saturday: 10:00 AM – 5:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderAboutPage = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            About Page Content
          </h2>
          <p className="text-sm text-slate-500">
            Update your About page hero and content.
          </p>
        </div>
        <button
          onClick={() => handleSave("About")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Page Title
          </label>
          <RichTextEditor
            value={aboutPage.title}
            onChange={(v) =>
              setAboutPage((p) => ({
                ...p,
                title: v,
              }))
            }
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Hero Image
          </label>
          <div className="flex flex-col gap-3">
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold w-full md:w-60 hover:bg-red-700">
              <Upload size={16} />
              Upload Hero Image
            </button>
            <div className="h-40 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-center text-xs text-slate-400">
              Hero image preview
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Main Content
          </label>
          <RichTextEditor
            rows={8}
            value={aboutPage.description}
            onChange={(v) =>
              setAboutPage((p) => ({
                ...p,
                description: v,
              }))
            }
            placeholder="Write about Zenelait Infotech, your mission, values and approach..."
          />
        </div>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Footer Content Management
          </h2>
          <p className="text-sm text-slate-500">
            Manage your website footer content, social links, and quick
            navigation links.
          </p>
        </div>
        <button
          onClick={() => handleSave("Footer")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        <h3 className="text-lg font-semibold text-slate-900">
          Basic Information
        </h3>
        <p className="text-xs text-slate-500">
          Update footer description and copyright text.
        </p>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Footer Description
          </label>
          <RichTextEditor
            rows={6}
            value={footerContent.description}
            onChange={(v) =>
              setFooterContent((p) => ({
                ...p,
                description: v,
              }))
            }
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Copyright Text
          </label>
          <input
            type="text"
            value={footerContent.copyright}
            onChange={(e) =>
              setFooterContent((p) => ({
                ...p,
                copyright: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
      </div>
    </>
  );

  const renderEnquiries = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Enquiries</h2>
          <p className="text-sm text-slate-500">
            View and manage enquiries submitted via the contact form.
          </p>
        </div>
        <button
          onClick={fetchContacts}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loadingEnquiries ? (
          <div className="py-10 flex items-center justify-center text-sm text-slate-500">
            Loading enquiries...
          </div>
        ) : enquiriesError ? (
          <div className="py-10 flex items-center justify-center text-sm text-red-500">
            {enquiriesError}
          </div>
        ) : contacts.length === 0 ? (
          <div className="py-10 flex items-center justify-center text-sm text-slate-500">
            No enquiries
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Phone</th>
                  <th className="px-6 py-3 text-left font-semibold">Subject</th>
                  <th className="px-6 py-3 text-left font-semibold">Message</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr
                    key={c._id || c.id}
                    className="border-b border-slate-100 hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {c.name}
                    </td>
                    <td className="px-6 py-3 text-slate-600">{c.email}</td>
                    <td className="px-6 py-3 text-slate-600">
                      {c.phone || "-"}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {c.subject || "-"}
                    </td>
                    <td className="px-6 py-3 text-slate-600 max-w-xs">
                      <span className="line-clamp-2">{c.message}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-md font-semibold ${
                          c.status === "new"
                            ? "bg-red-200 text-red-700"
                            : c.status === "read"
                            ? "bg-blue-200 text-blue-700"
                            : c.status === "replied"
                            ? "bg-green-200 text-green-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {c.status || "new"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "navbar":
        return renderNavbarSettings();
      case "home":
        return renderHomeContent();
      case "services":
        return renderServices();
      case "projects":
        return renderProjects();
      case "blog":
        return renderBlog();
      case "trust":
        return renderTrustStats();
      case "contactInfo":
        return renderContactInfo();
      case "about":
        return renderAboutPage();
      case "enquiries":
        return renderEnquiries();
      case "footer":
        return renderFooter();
      default:
        return null;
    }
  };

  // -------- MAIN RENDER --------

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Top admin header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
              ZI
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">
                Zenelait Infotech
              </p>
              <p className="text-[11px] text-slate-500">Admin Panel</p>
            </div>
          </div>

          {/* Top nav like website */}
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-700">
            <button
              onClick={() => window.open("/", "_self")}
              className="hover:text-red-600 flex items-center gap-1"
            >
              <HomeIcon size={14} />
              Home
            </button>
            <button
              onClick={() => window.open("/about", "_self")}
              className="hover:text-red-600"
            >
              About
            </button>
            <button
              onClick={() => window.open("/products", "_self")}
              className="hover:text-red-600"
            >
              Products
            </button>
            <button
              onClick={() => window.open("/service", "_self")}
              className="hover:text-red-600"
            >
              Services
            </button>
            <button
              onClick={() => window.open("/contact", "_self")}
              className="hover:text-red-600"
            >
              Contact
            </button>
            <button className="px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 text-[11px]">
              Get Started →
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 rounded-full border border-slate-200 text-xs w-40 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-slate-100">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100"
              >
                <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-xs text-white font-semibold">
                  ZI
                </div>
                <ChevronDown size={14} className="text-slate-600" />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-slate-200 shadow-lg text-xs overflow-hidden">
                  <button className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2">
                    <Settings size={14} />
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-red-500"
                    onClick={() => {
                      localStorage.removeItem("adminToken");
                      window.location.href = "/admin/login";
                    }}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admin section tabs */}
        <div className="border-t border-slate-200 bg-slate-50/60">
          <div className="max-w-7xl mx-auto px-6 py-2 flex flex-wrap gap-2">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    isActive
                      ? "bg-red-600 text-white border-red-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-6">{renderContent()}</main>

      {/* Bottom small footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-[11px] text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-6">
          <span>Zenelait Infotech Admin · Built with React & Tailwind CSS</span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} />
            Anna Nagar, Chennai
          </span>
        </div>
      </footer>
    </div>
  );


  <button
  onClick={() => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  }}
  className="text-red-500 px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
>
  <LogOut size={14} /> Logout
</button>

}
