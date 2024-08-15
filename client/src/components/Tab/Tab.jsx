import React from "react";

const Tab = ({ activeToggleSwitcher, toggleTab }) => {
  return (
    <div className="tabs">
      <li
        className="tab"
        onClick={() => activeToggleSwitcher(1)}
        id={toggleTab === 1 ? "active-tab" : "unactive-tab"}
      >
        Active
      </li>

      <li
        className="tab"
        onClick={() => activeToggleSwitcher(2)}
        id={toggleTab === 2 ? "active-tab" : "unactive-tab"}
      >
        All
      </li>
    </div>
  );
};

export default Tab;
