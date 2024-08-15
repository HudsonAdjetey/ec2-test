import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";

import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../../main";
import Loader from "../Preloader/Loader";
const CourseCards = memo(({ classSwitch, dataInfo }) => {
  const { user } = useSelector((state) => state.user);
  const userID = user.userID;
  const URL = `/api/course`;

  const [dataContainer, setData] = useState([]);

  const queryData = useQuery({
    queryKey: ["classList"], // unique string to identify this request (like a cache key)
    queryFn: async () => {
      const res = await api.get(`${URL}/ind-classes/`);
      return res;
    },
  });

  useEffect(() => {
    if (queryData?.data && queryData.isSuccess) {
      const allClasses = queryData.data.data.data;
      setData(allClasses);
    }
  }, [queryData.isSuccess]);

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  const submit = (link) => {
    window.location.href = link;
  };

  const daysUntilExpiry = (expiryDate) => {
    // Convert expiryDate to a JavaScript Date object
    const courseExpiry = new Date(expiryDate);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in milliseconds between the current date and expiry date
    const timeDifference = courseExpiry.getTime() - currentDate.getTime();

    // Calculate the difference in days
    const daysDifference = Math.round(timeDifference / (1000 * 3600 * 24));

    // Check if the course is about to expire
    if (daysDifference <= 2 && daysDifference > 0) {
      // Return a string indicating the remaining days
      if (daysDifference === 1) {
        return `${daysDifference} day`;
      } else {
        return `${daysDifference} days`;
      }
    }
  };

  function formatDateWithSuffix(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const suffixes = ["th", "st", "nd", "rd"];
    const relevantDigits = day < 30 ? day % 20 : day % 30;
    const suffix = relevantDigits <= 3 ? suffixes[relevantDigits] : suffixes[0];

    const formattedDate = `${day}${suffix} ${month} ${year}`;

    return formattedDate;
  }
  return (
    <div className="card__holder-course">
      {queryData.isLoading && <Loader />}
      <motion.div
        className="card__main-course"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {dataContainer?.map((content, index) => {
          return (
            <motion.div variants={item} key={index} className="c_card">
              <p className="c_name-main">
                <span>{content.name || content.courseName}</span>
                <span>{daysUntilExpiry(content.expiryDate)}</span>
              </p>
              <div className="cont_class">
                <p className="de_c">
                  <span>
                    Lesson <i>(session)</i>
                  </span>
                  <span>
                    {content.courseTitle == undefined
                      ? "No lesson at the moment"
                      : content.courseTitle}
                  </span>
                </p>
                <div className="date_c">
                  <p className="de_c">
                    <span>Date</span>
                    <span>
                      {content.date && formatDateWithSuffix(content.date)}{" "}
                    </span>
                  </p>

                  <p className="de_c">
                    <span>Time</span>
                    <span>{content.time} </span>
                  </p>
                </div>

                <div className="de_btn">
                  <a
                    href={content?.whatsAppLink}
                    target="_blank"
                    rel="noopener  noreferrer"
                  >
                    <i
                      className="bi bi-whatsapp"
                      style={{ color: "black" }}
                    ></i>
                  </a>
                  <button
                    onClick={() => submit(content.courseLink)}
                    disabled={
                      content.courseLink == undefined || null ? true : false
                    }
                    rel="noopener  noreferrer"
                  >
                    Join now
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
});

export default CourseCards;
