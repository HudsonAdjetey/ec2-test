import React from "react";
import LandingImg from "../assets/landing.png";
import { Link } from "react-router-dom";

const IntroPage = () => {
  return (
    <section className="rl__landing rl__first" id="home">
      <div className="intro__page">
        <div className="intro__text">
          <h1>
            Welcome to Learni
            <span className="highlight-sub">verse</span>{" "}
          </h1>
          <p className="intro__para">
            Partnering with experienced instructors and experts, we deliver
            high-quality content aimed at comprehensive skill development.
            Whether you're a beginner or seeking advanced proficiency,
            <span className="bLead"> Learn</span>
            <span className="bLead-sp bLead">iverse</span> is your gateway to a
            world of knowledge.
          </p>
          <Link to={"/signup"} className="cta__sign">
            <span to={"/signup"}>Sign Up Now</span>
            <i className="bi bi-arrow-right-circle-fill"></i>
          </Link>
        </div>
        <div className="landingImg">
          <img src={LandingImg} alt="virtual learning" />
        </div>
      </div>
    </section>
  );
};

export default IntroPage;
