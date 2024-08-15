import React from "react";
import { images } from "../../constants/images";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../main";
import { logOut } from "../../app/userSlice";
import { getAuth, signOut } from "firebase/auth";
import { toastError, toastSuccess } from "../toastify/toastMes";
const URL = `/api/auth`;

const NavDSK = () => {
  const { user } = useSelector((state) => state.user);
  const ad = import.meta.env.VITE_VAL == user.va1;

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
        </ul>
        <div className="lg-outlog">
          <a onClick={handleSignOut}>Log Out</a>
        </div>
      </nav>
    </div>
  );
};

export default NavDSK;
