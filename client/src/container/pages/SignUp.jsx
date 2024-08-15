import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BasicInfo from "../../components/Info/BasicInfo";
import GuardianInfo from "../../components/Info/GuardianInfo";
import ClassInfo from "../../components/Info/ClassInfo";
import Payment from "../../components/Info/Payment";
import { useMutation, useQuery } from "@tanstack/react-query";
import PaystackPop from "@paystack/inline-js";
import { api } from "../../main";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../app/userSlice";
import "../../container/style/auth.css";
import Loader from "../../components/Preloader/Loader";
import { toastError, toastSuccess } from "../../components/toastify/toastMes";

const SignUp = memo(() => {
  // tagLine
  const [tagLine, setTagLine] = useState(1);
  const [active, setActive] = useState(1);
  const [selectedClasses, setSelectedClasses] = useState([]);
  /* VISIBLE */
  const [visible, setIsVisible] = useState(false);
  const [visibleSec, setIsVisibleSec] = useState(false);
  const handleVisibleSwitchSec = () => {
    setIsVisibleSec(!visibleSec);
  };
  const handleVisibleSwitch = () => {
    setIsVisible(!visible);
  };

  /* VISIBLE */
  const activeTabToggler = (index) => {
    setActive(index);
  };
  /* FORM DATA */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contact: "",
    guardian: "",
    parentContact: "",
    photoUrl: "",
    address: "",
    courses: [],
    admissionPer: "",
    admissionThird: "",
    admission: "",
    month: "",
    amount: 0,
    totalCosts: 0,
    perMonth: 0,
    thirdMonth: 0,
    monthFee: 0,
    username: "",
    handleParentContactconfirmPassword: "",
    confirmPassword: "",
  });
  /* FORM DATA */

  const [mainData, setMainData] = useState([]);
  const [perMonth, setPerMonth] = useState("");
  const [monthAmount, setMountAmount] = useState("");

  const queryFunction = useQuery({
    queryKey: ["getCourses"],
    queryFn: async () => {
      try {
        const res = await api.get(`/api/course/course-all`);
        return res.data;
      } catch (error) {
        throw new Error("Failed to fetch courses");
      }
    },
  });

  TODO: "REMINDERS";
  // Ensure mainData state reflects the latest fetched data(queried)
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClass, setFilteredClass] = useState([]);
  useEffect(() => {
    if (queryFunction.isSuccess && queryFunction.data) {
      setMountAmount(queryFunction.data.monthFee);
      setPerMonth(queryFunction.data.admission);
      setMainData(queryFunction.data.classes);
    }
  }, [queryFunction.isSuccess, queryFunction.data]);
  const handleParentContact = (value) => {
    setFormData({ ...formData, parentContact: value });
  };
  /* CONTACT */
  const handleInputChange = (value) => {
    // Trim spaces from the input value
    const cleanedValue = value?.replace(/\s/g, "");

    // Validate the cleaned phone number
    const isValidNumber = validateNumber(cleanedValue);

    // If the number is valid, update the state
    if (isValidNumber) {
      setPhoneNumber(cleanedValue);
      setFormData({ ...formData, contact: cleanedValue });
    } else {
      return;
    }
  };

  const handleSearchValue = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (!mainData) {
      return;
    }

    const filteredClasses = mainData
      .filter((item) => {
        if (searchQuery === "") {
          return true;
        } else if (
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return true;
        }
        return false;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    setFilteredClass(filteredClasses);
  }, [searchQuery, mainData]);

  const validateNumber = (numberPhone) => {
    const phoneNumberValidate = /^\d{10}$/;
    return phoneNumberValidate.test(Number(numberPhone));
  };
  const handleSelection = (index) => {
    const selectedIndex = selectedClasses.findIndex(
      (item) => item.index === index
    );
    if (selectedIndex === -1) {
      const selectedClass = mainData.find((item) => item.index === index);
      setSelectedClasses([...selectedClasses, selectedClass]);
      setFormData({
        ...formData,
        courses: [...formData.courses, selectedClass],
      });
    } else {
      const updatedClasses = selectedClasses.filter(
        (item) => item.index !== index
      );
      setFormData({
        ...formData,
        courses: updatedClasses,
      });
      setSelectedClasses(updatedClasses);
    }
  };
  const isClassSelected = (index) => {
    return selectedClasses.some((item) => item.index === index);
  };

  const [amount, setAmount] = useState();

  useEffect(() => {
    const prices = selectedClasses.map((item) => {
      return {
        price: Number(item.price),
        admission: item.admission,
      };
    });

    let priceAmount = 0;

    prices.forEach((price) => {
      if (isNaN(price.admission)) {
        price.admission = 0;
      }
      if (active == 1) {
        priceAmount += Number(price.price * 1) + Number(price.admission);
      } else {
        priceAmount += Number(price.price * 3) + Number(price.admission);
      }
    });

    setAmount(priceAmount);
    setFormData({ ...formData, courseAmounts: priceAmount });
  }, [amount, selectedClasses, formData.admission, active, formData.monthFee]);

  useEffect(() => {
    if (active == 1 && perMonth !== "") {
      setFormData({
        ...formData,
        admissionPer: Number(perMonth),
        perMonth: Number(monthAmount),
        month: 1,
        admission: Number(perMonth),
        monthFee: Number(monthAmount),
      });
    } else if (active == 2) {
      setFormData({
        ...formData,
        monthFee: Number(monthAmount) * 2,
        thirdMonth: Number(monthAmount) * 2,
        month: 3,
      });
    }
  }, [active, perMonth, monthAmount]);
  const URL = `/api/auth/`;
  const mutation = useMutation({
    mutationKey: "signUp",
    mutationFn: (data) => {
      return api.post(`${URL}register`, data);
    },
  });

  const continueLine = () => {
    if (tagLine == 1) {
      if (
        formData.firstName == "" ||
        formData.lastName == "" ||
        formData.email == "" ||
        formData.password == "" ||
        formData.confirmPassword == ""
      ) {
        toastError("All fields required");
        return;
      }
      if (![...formData.email].includes("@")) {
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toastError("Mismatching passwords");
        return;
      }
    }
    const psLength = formData.password.length;
    if (psLength < 8 || formData.password.length < 8) {
      toastError("Password should not be less than 8 chars");
      return;
    }

    if (tagLine == 3) {
      if (selectedClasses.length < 1) {
        toastError("Select at least a class");
        return;
      }
    }
    if (tagLine < 4) {
      setTagLine((prev) => prev + 1);
    }
  };

  /* BACK */
  const backLine = () => {
    if (tagLine > 0) {
      setTagLine((prev) => prev - 1);
    }
  };
  /* BACK */

  /* PROCEED  */

  const handleInputs = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  /* HANDLE INPUTS */
  const [number, setPhoneNumber] = useState();

  const registerVerify = useMutation({
    mutationKey: "register",
    mutationFn: (data) => {
      return api.post("/api/auth/register", data);
    },
  });

  const initialize = useMutation({
    mutationKey: "initializePayment",
    mutationFn: (data) => {
      return api.post("/api/auth/initialize", data);
    },
  });

  const courseRegisterMutation = useMutation({
    mutationKey: "courseRegistration",
    mutationFn: (data) => {
      return api.post(`/api/course/register-course`, data);
    },
  });
  const cancelRegistration = useMutation({
    mutationKey: "cancelRegistration",
    mutationFn: (id) => {
      return api.delete(`/api/course/cancel-course/${id}`);
    },
  });
  const removeStudent = useMutation({
    mutationFn: (id) => {
      return api.delete(`${URL}delete-student/${id}`);
    },
  });
  const { user } = useSelector((state) => state.user);
  const failedPayment = async (courseId) => {
    try {
      const cancel = await cancelRegistration.mutateAsync(courseId);
      // Further actions or error handling based on cancellation response
    } catch (error) {
      console.error("Cancellation failed:", error);
      // Handle cancellation failure
    }
  };
  const removeStudentUser = async (idValue) => {
    try {
      const deleteStudent = await removeStudent.mutateAsync(idValue);
    } catch (error) {
      console.log(error);
    }
  };
  /* CONTACT */
  /* PROCEED  */

  /* CLASS SELECTION */
  const dispatch = useDispatch();
  const handlePayment = async () => {
    try {
      const paymentData = {
        email: formData.email,
        amount: formData.courseAmounts * 100,
        firstName: formData.firstName,
        lastName: formData.lastName,
        reference: "" + Math.floor(Math.random() * 1000000000 + 1),
      };
      const resp = await initialize.mutateAsync(paymentData);

      const authorizationUrl = resp.data.authorization_url;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: import.meta.env.VITE_APP_PAYSTACK_KEY,
        email: formData.email,
        amount: `${formData.courseAmounts * 100}`,
        reference: paymentData.reference,
        authorizationUrl: authorizationUrl,
        onClose: function () {
          let id;

          if (user?.userID) {
            id = user?.userID;
          }
          toastError("Payment cancelled");
          failedPayment(id);

          return;
        },
        callback: async function (popResponse) {
          try {
            const verifyResponse = await registerVerify.mutateAsync({
              ...formData,
              reference: paymentData.reference,
            });

            dispatch(setUser(verifyResponse.data.data));
            toastSuccess("Registered");
          } catch (error) {
            console.log(error);
          }
        },
      });
    } catch (error) {
      toastError(error.response.data.message);
      console.log("error", error);
    }
  };

  return (
    <section className="auth__page">
      <div
        className="l-hea-auth"
        style={{ display: tagLine === 1 ? "flex" : "none" }}
      >
        <h1 className="log-t-ma">
          <Link to={"/home"}>
            Learn<span className="highlight-sub">iverse</span>
          </Link>{" "}
        </h1>
        <div className="opt-q-a">
          <span>Have an Account? </span>
          <Link to={"/login"}>Sign In</Link>
        </div>
      </div>

      <div
        className="fx-sign fx-col xl-auth-container"
        style={{ display: tagLine === 1 ? "flex" : "none" }}
      >
        {/* BASIC INFO */}
        <BasicInfo
          email={formData.email}
          pwd={formData.password}
          firstName={formData.firstName}
          lastName={formData.lastName}
          confirmPwd={formData.confirmPassword}
          tagLine={tagLine}
          handleInputs={handleInputs}
          visible={visible}
          handleVisibleSwitch={handleVisibleSwitch}
          handleVisibleSwitchSec={handleVisibleSwitchSec}
          visibleSec={visibleSec}
          contact={formData.contact}
          handleInputChange={handleInputChange}
        />
        {/* BASIC INFO */}
      </div>

      {/* GUARDIAN */}
      <div
        className="fx-sign fx-col xl-auth-container"
        style={{ display: tagLine === 2 ? "flex" : "none" }}
      >
        <GuardianInfo
          tagLine={tagLine}
          guardian={formData.guardian}
          address={formData.address}
          handleInputChange={handleInputChange}
          parentContact={formData.parentContact}
          handleInputs={handleInputs}
        />
      </div>
      {/* GUARDIAN */}

      {/* CLASS INFO */}
      <div
        className="clx-cl-co"
        style={{ display: tagLine === 3 ? "flex" : "none" }}
      >
        <ClassInfo
          dataInfo={filteredClass}
          isClassSelected={isClassSelected}
          search={searchQuery}
          handleInputs={handleSearchValue}
          selectedClass={selectedClasses}
          handleSelection={handleSelection}
        />
      </div>
      <div
        className="clx-cl-co"
        style={{ display: tagLine === 4 ? "flex" : "none" }}
      >
        {mutation.isPending || (initialize.isPending && <Loader />)}
        <Payment
          tagLine={tagLine}
          active={active}
          activeTabToggler={activeTabToggler}
          totalAmount={amount}
          handlePayment={handlePayment}
          selectedClass={selectedClasses}
        />
      </div>
      {/* CLASS INFO */}

      <div className="pr-al-btns">
        {tagLine > 1 ? (
          <button className="proceedBtn" onClick={backLine}>
            Back
          </button>
        ) : null}

        <button
          onClick={continueLine}
          style={tagLine <= 3 ? { display: "block" } : { display: "none" }}
          className="proceedBtn"
        >
          {tagLine <= 3 && "Proceed"}
        </button>
      </div>
    </section>
  );
});

export default SignUp;
