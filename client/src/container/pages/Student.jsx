import React from "react";
import { useState } from "react";
import Tab from "../../components/Tab/Tab";
import TabActive from "../../components/Model/TabActive.1";
import TabAll from "../../components/Table/SubTable/TabAll";
import AdminMobile from "../../components/NavMenu/AdminNav";

const Student = () => {
  /* TAB FUNCTION */
  const [toggleTab, setToggleTab] = useState(1);
  const activeToggleSwitcher = (index) => {
    setToggleTab(index);
  };
  /* TAB FUNCTION */
  return (
    <div className="x-t-pages">
      <div className="x-ac-header t-hea">
        <h4>Students </h4>
        <AdminMobile />
      </div>

      <Tab activeToggleSwitcher={activeToggleSwitcher} toggleTab={toggleTab} />

      {toggleTab == 1 ? <TabActive /> : <TabAll />}
    </div>
  );
};

export default Student;
