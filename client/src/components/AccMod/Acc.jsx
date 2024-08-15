import React from "react";
import { useRef } from "react";
import { memo } from "react";
import { useSelector } from "react-redux";
import PhoneInput from "react-phone-number-input";
import { images } from "../../constants/images";
import { useState } from "react";

const Acc = memo(
  ({
    setImage,
    profile,
    fullName,
    handleSubmit,
    handleInputChange,
    contact,
    handleInputs,
    firstName,
    lastName,
    currentPassword,
    password,
  }) => {
    const fileRef = useRef(null);
    const { user } = useSelector((state) => state.user);
    const [visible, setIsVisible] = useState(false);

    return (
      <div className="x-mod-acc">
        <div className="img-profile">
          <input
            type="file"
            ref={fileRef}
            hidden
            name="file"
            accept="image/*"
            onChange={setImage}
          />

          <div className="upload-img">
            <img src={profile} alt="" onClick={() => fileRef.current.click()} />
          </div>
          <div className="name__sub">
            <h3>{user.firstName + " " + user.lastName}</h3>
            <p className="status">{user.va1}</p>
          </div>
        </div>

        <div className="form-co-profile">
          <form onSubmit={handleSubmit}>
            <div className="do-input">
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleInputs}
              />
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleInputs}
              />
            </div>

            <div className="do-input">
              <input type="email" value={user.email} readOnly />
              <input
                type="tel"
                name="contact"
                value={contact || ""}
                onChange={handleInputChange}
                placeholder="Contact"
              />
            </div>

            <div className="do-input">
              <input
                type="password"
                placeholder="Password"
                value={currentPassword}
                name="currentPassword"
                onChange={handleInputs}
              />

              <input
                type="password"
                placeholder=" Confirm Password"
                name="password"
                value={password}
                onChange={handleInputs}
              />
            </div>

            <div className="updateBtn">
              <button onClick={handleSubmit}>Update Profile</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default Acc;
