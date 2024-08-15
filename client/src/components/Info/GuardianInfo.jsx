import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const GuardianInfo = ({
  tagLine,
  guardian,
  handleInputs,
  address,
  parentContact,
  handleInputChange,
}) => {
  return (
    <div
      className={`fx-col f-x-container ${
        tagLine === 2 ? "activeTab" : "unActive"
      }`}
    >
      <div>
        <h2>Guardian Info (optional)</h2>
      </div>

      <form>
        {/* INPUT CONTAINERS */}

        <div className="input__field">
          <i className="bi bi-person-fill"></i>
          <input
            type="guardian"
            name="guardian"
            placeholder="Guardian Name"
            required
            value={guardian}
            onChange={handleInputs}
          />
        </div>
        <div className="input__field">
          <i className="bi bi-person-fill-lock"></i>
          <input
            type="address"
            name="address"
            placeholder="Address"
            required
            value={address}
            onChange={handleInputs}
          />
        </div>

        {/* INPUT CONTAINERS */}

        {/* BUTTON */}
        <div className="input__field">
          <PhoneInput
            defaultCountry="GH"
            numberInputProps={{
              minLength: "9",
              placeholder: "Contact",
              id: "parentContact",
            }}
            name="parentContact"
            value={parentContact}
            onChange={handleInputChange}
          />
        </div>
      </form>
      {/* <button>Continue Google</button> */}
    </div>
  );
};

export default GuardianInfo;
