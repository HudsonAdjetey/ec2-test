import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const BasicInfo = ({
  email,
  handleInputs,
  visible,
  pwd,
  handleVisibleSwitch,
  firstName,
  lastName,
  confirmPwd,
  tagLine,
  handleVisibleSwitchSec,
  visibleSec,
  contact,
  handleInputChange,
}) => {
  return (
    <div
      className={` f-x-container ${tagLine === 1 ? "activeTab" : "unActive"}`}
    >
      <div>
        <h2>Basic Info</h2>
      </div>

      <form>
        {/* INPUT CONTAINERS */}
        <div className="input__field">
          <i className="bi bi-person-fill"></i>
          <input
            type="name"
            name="firstName"
            placeholder="First Name"
            required
            value={firstName}
            onChange={handleInputs}
          />
        </div>

        <div className="input__field">
          <i className="bi bi-person-fill"></i>
          <input
            type="lastName"
            name="lastName"
            placeholder="Last Name"
            required
            value={lastName}
            onChange={handleInputs}
          />
        </div>
        <div className="input__field">
          <i className="bi bi-person-fill-lock"></i>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleInputs}
          />
        </div>

        <div className="input__field">
          <i className="bi bi-lock-fill"></i>
          <input
            placeholder="Password"
            name="password"
            required
            type={visible ? "text" : "password"}
            value={pwd}
            onChange={handleInputs}
          />
          {visible ? (
            <span
              onClick={handleVisibleSwitch}
              className="eye_icon bi bi-eye-fill"
            ></span>
          ) : (
            <span
              onClick={handleVisibleSwitch}
              className="eye_icon bi bi-eye-slash-fill"
            ></span>
          )}
        </div>

        {/* CONFIRM */}
        <div className="input__field">
          <i className="bi bi-lock-fill"></i>
          <input
            placeholder="confirmPassword"
            name="confirmPassword"
            required
            type={visibleSec ? "text" : "password"}
            value={confirmPwd}
            onChange={handleInputs}
          />
          {visibleSec ? (
            <span
              onClick={handleVisibleSwitchSec}
              className="eye_icon bi bi-eye-fill"
            ></span>
          ) : (
            <span
              onClick={handleVisibleSwitchSec}
              className="eye_icon bi bi-eye-slash-fill"
            ></span>
          )}
        </div>

        {/* INPUT CONTAINERS */}

        {/* BUTTON */}
        <div className="input__field">
          <PhoneInput
            defaultCountry="GH"
            numberInputProps={{
              minLength: "9",
              placeholder: "Personal Contact",
              id: "personalContact",
            }}
            name="contact"
            value={contact}
            onChange={handleInputChange}
          />
        </div>
      </form>
      {/* <button>Continue Google</button> */}
    </div>
  );
};

export default BasicInfo;
