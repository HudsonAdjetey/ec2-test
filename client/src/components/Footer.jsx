import React from "react";
import "../container/style/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social_icons flex-row">
        <span>Connect with us</span>
        <span className="flex-row">
          <i className="bi bi-facebook">
            <a href="" className="hover_name">
              Facebook
            </a>
          </i>
          <i className="bi bi-twitter-x">
            <a className="hover_name">Twitter</a>
          </i>
          <i className="bi bi-whatsapp">
            <a className="hover_name">WhatsApp</a>
          </i>
          <i className="bi bi-telephone-fill">
            <a className="hover_name">Contact</a>
          </i>
        </span>
      </div>
      <div className="copyRight">
        <p>©2024 All rights reserved | Powered by Ikob Technologies</p>
      </div>
    </footer>
  );
};

export default Footer;
