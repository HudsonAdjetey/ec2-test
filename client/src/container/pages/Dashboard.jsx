import React from "react";
import HeaderDSK from "../../components/NavMenu/HeaderDSK";
import Banner from "../../components/Banner/Banner";
import HomeTable from "../../components/Table/HomeTable";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const ad = import.meta.env.VITE_VAL == user.va1;
  return (
    <section className="h-c-main">
      <HeaderDSK nameInfo={"Dashboard"} link={"/dashboard/account"} />

      <div className="content__pageWhole">
        <Banner />

        <p className="text-overview">Over View</p>
        <HomeTable />
      </div>
    </section>
  );
};

export default Dashboard;
