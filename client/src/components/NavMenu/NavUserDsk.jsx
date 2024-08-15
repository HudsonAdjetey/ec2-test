import React from "react";
import { images } from "../../constants/images";
import { Link } from "react-router-dom";

const NavUserDsk = () => {
  return (
    <div className="nav-menu-dsk dsk">
      <div className="logo-cont-xl">
        <img src={images.favicon} alt="logo" />
        <h3>Learniverse</h3>
      </div>

      <nav className="__sideNav">
        <ul className="xl-nav-content">
          <li className="nav-li-co">
            <span className="bi bi-house-fill"></span>
            <Link to={"/"}>Home</Link>
          </li>
          <li className="nav-li-co">
            <span className="bi bi-person-fill"></span>
            <Link to={"/account"}>Account Profile</Link>
          </li>

          <li className="nav-li-co">
            <span className="bi bi-wallet-fill"></span>
            <Link to={"/subscription"}>Subscription</Link>
          </li>

          <li className="nav-li-co">
            <span className="bi bi-gear-fill"></span>
            <Link to={"/settings"}>Settings</Link>
          </li>
        </ul>
        <div className="lg-outlog">
          <Link to={"/logout"}>Log Out</Link>
        </div>
      </nav>
    </div>
  );
};

export default NavUserDsk;
