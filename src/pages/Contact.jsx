import React, { useState } from "react";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Contactimage from "../assets/contact-image.jpg";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("http://localhost:5000/api/contacts/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Your message has been sent successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong! Try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <main className="contact-main">
        <div className="contact-hero">
          <h1>Contact Us</h1>
          <p>Get in touch with our team to discuss how we can help your business.</p>
        </div>

        <div className="contact-grid">
          <div className="left-column">
            <div className="contact-form-card">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Full Name *
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </label>

                <label>
                  Email Address *
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </label>

                <label>
                  Phone Number *
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 123 456 7890"
                    required
                  />
                </label>

                <label>
                  Message *
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us your requirements..."
                    required
                  />
                </label>

                <button type="submit" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}{" "}
                  <Send className="send-icon" />
                </button>
              </form>
            </div>

            <div className="map-page">
              <h2>Find Us Here</h2>
              <p>Visit our office in Anna Nagar, Chennai</p>

              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3886.2140434074886!2d80.21272390000001!3d13.085616899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDA1JzA4LjIiTiA4MMKwMTInNDUuOCJF!5e0!3m2!1sen!2sin!4v1764016344984!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Zenelait Location"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="contact-right">
            <div className="contact-image">
              <img src={Contactimage} alt="Office" />
            </div>

            <div className="contact-info-card">
              <h2>Contact Information</h2>
              <div className="info-item">
                <MapPin className="info-icon" />
                <p>
                  Zenelait Infotech<br />
                  Y Block 1st Street,<br />
                  Anna Nagar, Chennai - 600040,<br />
                  Tamil Nadu, India
                </p>
              </div>

              <div className="info-item">
                <Phone className="info-icon" />
                <p>+91 9884264816</p>
              </div>

              <div className="info-item">
                <Mail className="info-icon" />
                <p>zenelaitinfotech@gmail.com</p>
              </div>
            </div>

            <div className="business-hours-card">
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9:30 AM - 6:30 PM</p>
              <p>Saturday & Sunday: Closed</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
