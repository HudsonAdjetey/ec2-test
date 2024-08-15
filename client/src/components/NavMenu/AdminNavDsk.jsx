import React from "react";
import { images } from "../../constants/images";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../main";
import { logOut } from "../../app/userSlice";
import { getAuth, signOut } from "firebase/auth";
import { toastError, toastSuccess } from "../toastify/toastMes";
const URL = `/api/auth`;

const AdminNav = () => {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      await api.post(`${URL}/signout`);

      dispatch(logOut());
      toastSuccess("Logged Out");
    } catch (error) {
      toastError("Something went wrong");
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <div className="nav-menu-dsk dsk">
      <Link to={"/dashboard"} className="logo-cont-xl">
        <img src={images.favicon} alt="logo" />
        <h3>Learniverse</h3>
      </Link>

      <nav className="__sideNav">
        <ul className="xl-nav-content">
          <li className="adBtn-nav">
            <Link to={"/dashboard/student"}> Add student </Link>
            <Link
              to={"/dashboard/student"}
              className="bi bi-plus-circle-fill bi-plus"
            ></Link>
          </li>
          <li className="nav-li-co">
            <span className="bi bi-house-fill"></span>
            <Link to={"/dashboard"}>Home</Link>
          </li>
          <li className="nav-li-co">
            <span className="bi bi-person-fill"></span>
            <Link to={"/dashboard/account"}>Account Profile</Link>
          </li>
          <li className="nav-li-co">
            <span className="bi bi-people-fill"></span>
            <Link to={"/dashboard/student"}>Students</Link>
          </li>
          <li className="nav-li-co">
            <span className="bi bi-houses-fill"></span>
            <Link to={"/dashboard/classes"}>Classes</Link>
          </li>

          <li className="nav-li-co">
            <span className="bi bi-tv-fill"></span>
            <Link to={"/dashboard/schedule"}>Schedule</Link>
          </li>
          <li className="nav-li-co">
            <span className="bi bi-gear-fill"></span>
            <Link to={"/dashboard/settings"}>Settings</Link>
          </li>
        </ul>
        <div className="lg-outlog">
          <a onClick={handleSignOut}>Log Out</a>
        </div>
      </nav>
    </div>
  );
};

export default AdminNav;
