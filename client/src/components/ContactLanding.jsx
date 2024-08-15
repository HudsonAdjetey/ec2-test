import React from "react";
import { ContactUs } from "../components/ContactForm";

const ContactLanding = () => {
  return (
    <section id="contact" className="rl__last contact__page">
      <div className="contact__content">
        <div className="contact__header">
          <h3>Contact Us</h3>
        </div>
        <ContactUs />
      </div>
    </section>
  );
};

export default ContactLanding;
