import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../container/style/error.css";

const ErrorPage = () => {
  const { user } = useSelector((state) => state.user);
  const isAdmin = user && user?.va1 === import.meta.env.VITE_VAL;
  return (
    <div className="notFound">
      <div className="content__error">
        <h1>Oops! Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <div className="error-btn">
          <button>
            {isAdmin ? (
              <Link to={"/dashboard"}>Return Home</Link>
            ) : (
              <Link to={"/"}>Return Home</Link>
            )}
          </button>
        </div>
      </div>
      {/* You can add a link back to home or other pages */}
    </div>
  );
};

export default ErrorPage;
