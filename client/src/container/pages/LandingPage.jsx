import React, { useEffect, useState } from "react";
import MenuMobile from "../../components/MenuMobile";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import IntroPage from "../../components/IntroPage";
import MidLanding from "../../components/MidLanding";
import ContactLanding from "../../components/ContactLanding";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPos > 0);
    };

    window.addEventListener("scroll", handleScroll);
    // detach the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="landing__page">
      {/* header */}
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="logo__text">
          <h2 className="logo__title">
            Learni<span>verse</span>
          </h2>
        </div>

        {/* LINKS */}
        <MenuMobile />
        <ul className="ul__links dsk">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li className="Menucre__btns dskLog">
            <Link to={"/login"}>Login</Link>
          </li>
        </ul>

        {/* LINKS */}
      </header>
      {/* header */}

      {/* INTRO PAGE */}
      <IntroPage />
      {/* INTRO PAGE */}

      {/* MID LANDING */}
      <MidLanding />
      {/* MID LANDING */}

      {/* CONTACT */}
      <ContactLanding />
      {/* CONTACT */}
      <Footer />
    </main>
  );
};

export default LandingPage;
