import React from "react";
import { images } from "../constants/images";

const MidLanding = () => {
  return (
    <section id="about" className=" rl__last rl__landing">
      <div className="grid__container">
        <div className="about__info box box__one">
          <h3>About Learniverse</h3>
          <h2>
            Our Dream is to provide <span>Resourceful</span> and{" "}
            <span> Effective</span> E-learning Experience
          </h2>
        </div>
        <div className="box box__two">
          <p>
            Learniverse is a cutting-edge e-learning website that offers a
            diverse range of courses across various subjects and skill levels.
            Our platform is designed to empower learners of all backgrounds with
            interactive lessons, videos, quizzes, and assignments that make
            learning enjoyable and effective. We partner with experienced
            instructors and subject matter experts to provide high-quality
            content. Discover the world of knowledge and skill development with
            Learniverse.{" "}
            <span>
              <b>We offer variety of courses </b>
            </span>
            from Upper to Lower level institutions.
          </p>
        </div>

        <div className="box box__three">
          <p className="abs">
            <i className="bi bi-book-fill"></i>
            <span>Mechanical Engineering Courses</span>
          </p>
          <img src={images.mech} alt="mechanical engineering student" />
        </div>
        <div className="box box__four">
          <p className="abs">
            <i className="bi bi-book-fill"></i>

            <span>Electrical Engineering Courses</span>
          </p>
          <img src={images.electrical} alt="electrical engineering student" />
        </div>
        <div className="box box__five">
          <p className="abs">
            <i className="bi bi-book-fill"></i>

            <span>Petroleum Engineering Courses</span>
          </p>
          <img src={images.petros} alt="petroleum engineering student" />
        </div>
        <div className="box box__six">
          <p className="abs">
            <i className="bi bi-book-fill"></i>

            <span>Computer Engineering Courses</span>
          </p>
          <img src={images.cs} alt="computer engineering student" />
        </div>
        <div className="box box__seven">
          <p className="abs">
            <i className="bi bi-book-fill"></i>

            <span>Senior High Courses</span>
          </p>
          <img src={images.highLearning} alt="high school student" />
        </div>
        <div className="box box__eight">
          <p className="abs">
            <i className="bi bi-book-fill"></i>

            <span>All basic level subjects</span>
          </p>
          <img src={images.kidLearning} alt="kid learning" />
        </div>
      </div>
    </section>
  );
};

export default MidLanding;
