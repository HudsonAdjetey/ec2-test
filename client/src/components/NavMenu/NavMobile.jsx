import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { api } from "../../main";
import { logOut } from "../../app/userSlice";
import { toastError, toastSuccess } from "../toastify/toastMes";
const URL = `/api/auth`;

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

export default function NavMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const handleLinkClick = () => {
    setIsOpen(false); // Close the menu when a link is clicked
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach the click event listener when the menu is open
    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
    }

    // Detach the event listener when the component unmounts or the menu is closed
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  const { user } = useSelector((state) => state.user);
  const ad = import.meta.env.VITE_VAL == user.va1;
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // Send a request to the server to handle server-side logout
      await api.post(`${URL}/signout`);

      dispatch(logOut());
      toastSuccess("Logged Out");
    } catch (error) {
      toastError("Something went wrong");
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className={`nav__menu mbl ${isOpen ? "open" : ""}`}
      style={isOpen ? { height: "auto" } : { height: 0 }}
      ref={menuRef}
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="mobile_menuBtn"
      >
        Menu
        <motion.div
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 },
          }}
          transition={{ duration: 0.2 }}
          style={{ originY: 0.55 }}
        >
          <svg width="15" height="15" viewBox="0 0 20 20">
            <path d="M0 7 L 20 7 L 10 16" />
          </svg>
        </motion.div>
      </motion.button>
      <motion.ul
        variants={{
          open: {
            clipPath: "inset(0% 0% 0% 0% round 10px)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.05,
            },
          },

          closed: {
            clipPath: "inset(10% 50% 90% 50% round 10px)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        className="menu__ulLinks"
      >
        <motion.li variants={itemVariants}>
          <Link to={"/"} className="link" onClick={handleLinkClick}>
            Home
          </Link>
        </motion.li>

        <motion.li variants={itemVariants}>
          <Link to={"/account"} className="link" onClick={handleLinkClick}>
            Profile
          </Link>
        </motion.li>

        <motion.li variants={itemVariants}>
          <Link to={"/subscription"} className="link" onClick={handleLinkClick}>
            Subscription
          </Link>
        </motion.li>

        <motion.li className="Menucre__btns" variants={itemVariants}>
          <a onClick={handleSignOut}>Log Out</a>
        </motion.li>
      </motion.ul>
    </motion.nav>
  );
}
