import React, { useState } from "react";
import { Link } from "react-router-dom";
import { images } from "../../constants/images";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../main";
import { useMutation } from "@tanstack/react-query";
import { setUser } from "../../app/userSlice";
import "../../container/style/auth.css";
import Loader from "../../components/Preloader/Loader";
import { toastError, toastSuccess } from "../../components/toastify/toastMes";
const URL = `/api/auth`;

const Login = () => {
  const [visible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [errState, setErrState] = useState(false);
  /* HANDLE SWITCH */
  const handleVisibleSwitch = () => {
    setIsVisible(!visible);
  };
  /* HANDLE SWITCH */
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationKey: "login",
    mutationFn: (data) => {
      return api.post(`${URL}/signin`, data);
    },
  });

  /* HANDLE INPUTS */
  const handleInputs = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPwd(e.target.value);
      if (pwd.length < 8) {
        setErr("Password must be less than 9 chars");
      }
    }
  };
  /* HANDLE INPUTS */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (email == "" || pwd == "") {
      toastError("All fields are required");
      return;
    }
    try {
      const res = await mutation.mutateAsync({
        email: email,
        password: pwd,
      });
      const dataResponse = res.data.data;
      dispatch(setUser(dataResponse));
      // toastSuccess("Logged In");
      setEmail("");
      setPwd("");
      toastSuccess("Success");
    } catch (error) {
      toastError(error?.response?.data);
      if (error?.response?.status == 500) {
        toastError("Check your internet");
      }
    }
  };

  return (
    <section className="auth__page">
      {mutation.isPending && <Loader />}
      <div className="l-hea-auth">
        <h1 className="log-t-ma">
          <Link to={"/home"}>
            Learn<span className="highlight-sub">iverse</span>
          </Link>{" "}
        </h1>
        <div className="opt-q-a">
          <span>New User? </span>
          <Link to={"/signup"}>Sign Up</Link>
        </div>
      </div>
      <div className="xl-auth-container">
        <div className="w-i-ma">
          <img src={images.Welcome} alt="" />
        </div>
        {/* FORM AUTH */}
        <div className="f-x-container">
          <div>
            <h2>Login to your account</h2>
          </div>

          <form onSubmit={onSubmit}>
            {/* INPUT CONTAINERS */}
            <div className="input__field">
              <i className="bi bi-person-fill-lock"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={email}
                onChange={handleInputs}
              />
            </div>

            <div className="input__field">
              <i className="bi bi-lock-fill"></i>
              <input
                placeholder="Password"
                name="password"
                required
                type={visible ? "text" : "password"}
                value={pwd}
                onChange={handleInputs}
              />
              {visible ? (
                <span
                  onClick={handleVisibleSwitch}
                  className="eye_icon bi bi-eye-fill"
                ></span>
              ) : (
                <span
                  onClick={handleVisibleSwitch}
                  className="eye_icon bi bi-eye-slash-fill"
                ></span>
              )}
            </div>

            {/* INPUT CONTAINERS */}

            {/* BUTTON */}
            <div className="submit__btn ">
              <button>Login</button>
            </div>
          </form>
          {/* <button>Continue Google</button> */}
        </div>
      </div>
    </section>
  );
};

export default Login;
