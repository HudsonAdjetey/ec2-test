import React from "react";
import HeaderDSK from "../../components/NavMenu/HeaderDSK";
import Banner from "../../components/Banner/Banner";
import HomeTable from "../../components/Table/HomeTable";
import { useSelector } from "react-redux";
import Classes from "./Classes";
import Student from "./Student";
import CourseCards from "../../components/CouseCards/CourseCards";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const ad = import.meta.env.VITE_VAL == user.va1;
  return (
    <section className="h-c-main">
      <HeaderDSK nameInfo={"My Space"} link={"/account"} />
      <div className="content__pageWhole">
        <Banner />

        <p className="text-overview">Classes</p>
        <CourseCards />
      </div>
    </section>
  );
};

export default Home;
