import React from "react";
import { Link } from "react-router-dom";
import NavMobile from "./NavMobile";
import { useSelector } from "react-redux";
import AdminMobile from "./AdminNav";

const HeaderDSK = ({ nameInfo, link }) => {
  const { user } = useSelector((state) => state.user);
  const isAdmin = user && user?.va1 === import.meta.env.VITE_VAL;
  return (
    <header className="t-hea">
      <div className="ri-hea">
        <h3>{nameInfo}</h3>
      </div>
      <Link to={link} className="le-hea dsk">
        <img src={user.profile} alt="profile image" />
        <span>{`${user.firstName} ${user.lastName}`}</span>
      </Link>
      {isAdmin ? <AdminMobile /> : <NavMobile />}
    </header>
  );
};

export default HeaderDSK;
