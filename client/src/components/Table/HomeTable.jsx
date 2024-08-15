import { memo, useState } from "react";
import TabAllActive from "./SubTable/TabAllActive";
import TabAll from "./SubTable/TabAll";

const HomeTable = memo(() => {
  const [toggleTab, setToggleTab] = useState(1);
  const activeToggleSwitcher = (index) => {
    setToggleTab(index);
  };
  return (
    <div className="home__table">
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

      {toggleTab == 1 && <TabAllActive />}
      {toggleTab == 2 && <TabAll />}
    </div>
  );
});

export default HomeTable;
