import React, { memo } from "react";
import Set from "../../components/Modal/Set";
import AdminMobile from "../../components/NavMenu/AdminNav";
import "../style/settings.css";

const Settings = memo(() => {
  return (
    <div className="x-t-pages">
      <div className="x-ac-header t-hea">
        <h4>Settings </h4>
        <AdminMobile />
      </div>
      <div className="active-content tab-co-mod">
        <Set />
      </div>
    </div>
  );
});

export default Settings;
