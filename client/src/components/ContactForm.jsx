import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

export const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_u1gnpq5",
        import.meta.env.VITE_TEMPLATE_KEY,
        form.current,
        import.meta.env.VITE_PUBLIC_KEY
      )
      .then(
        (result) => {
          if (result.text == "OK") {
            console.log(result.text);
            document.querySelectorAll("input").value = "";
          }
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div className="email__form_container">
      <form ref={form} onSubmit={sendEmail}>
        <div className="form__input">
          <label htmlFor="user_name">Name</label>
          <input type="text" id="user_name" name="user_name" />
        </div>
        <div className="form__input">
          <label htmlFor="user_email">Email</label>
          <input type="email" id="user_email" name="user_email" />
        </div>
        <div className="form__input">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" />
        </div>
        <div className="sndBtn">
          <button type="submit">
            <span>Send</span>
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </form>
    </div>
  );
};
