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
import PaymentIn from "../../components/Info/PaymentIn";
import ClassInfoIn from "../../components/Info/ClassInfoIn";
import AdminMobile from "../../components/NavMenu/AdminNav";
import NavMobile from "../../components/NavMenu/NavMobile";
import { toastError } from "../../components/toastify/toastMes";

const Subscription = memo(() => {
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
        admissionThird: 0,
        admissionPer: 0,
        perMonth: Number(monthAmount),
        month: 1,
        admission: Number(0),
        monthFee: Number(monthAmount),
      });
    } else if (active == 2) {
      setFormData({
        ...formData,
        admissionThird: 0,
        admission: 0,
        monthFee: Number(monthAmount) * 2,
        admissionPer: 0,
        thirdMonth: Number(monthAmount) * 2,
        month: 3,
      });
    }
  }, [active, perMonth, monthAmount]);
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
        priceAmount += Number(price.price * 1) + Number(price.admission * 0);
      } else {
        priceAmount += Number(price.price * 3) + Number(price.admission * 0);
      }
    });

    setAmount(priceAmount);
    setFormData({ ...formData, courseAmounts: priceAmount });
  }, [amount, selectedClasses, formData.admission, active, formData.monthFee]);
  const URL = `/api/auth/`;
  const mutation = useMutation({
    mutationKey: "signUp",
    mutationFn: (data) => {
      return api.post(`${URL}register`, data);
    },
  });

  const continueLine = () => {
    if (tagLine == 1) {
      if (selectedClasses.length < 1) {
        alert("Select");
        return;
      }
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
    mutationKey: "initializePaymentMain",
    mutationFn: async (data) => {
      return await api.post("/api/course/initialize", data);
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
  const { user } = useSelector((state) => state.user);
  /* CLASS SELECTION */
  const dispatch = useDispatch();
  const handlePayment = async () => {
    try {
      const paymentData = {
        email: user.email,
        amount: formData.courseAmounts * 100,
        firstName: user.firstName,
        lastName: user.lastName,
        courses: selectedClasses,
        reference: "" + Math.floor(Math.random() * 1000000000 + 1),
      };
      const resp = await initialize.mutateAsync(paymentData);

      const authorizationUrl = resp.data.authorization_url;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: import.meta.env.VITE_APP_PAYSTACK_KEY,
        email: user.email,
        amount: `${formData.courseAmounts * 100}`,
        reference: paymentData.reference,
        authorizationUrl: authorizationUrl,
        onClose: function () {
          alert("Payment closed");
        },
        callback: async function (popResponse) {
          try {
            const courseRes = await courseRegisterMutation.mutateAsync({
              id: user.userID,
              courses: selectedClasses,
              month: formData.month,
              reference: paymentData.reference,
            });

            if (!courseRes) {
              console.log("Not registered");
              await removeStudentUser.mutateAsync(idValue);
            }
          } catch (error) {
            console.log(error);
          }
        },
      });
    } catch (error) {
      console.log("error", error?.response);
      toastError(error?.response?.data.message);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (courseRegisterMutation.isSuccess) {
      navigate("/");
    }
  }, [courseRegisterMutation.isSuccess]);

  return (
    <section className="auth__page">
      {/* CLASS INFO */}
      <div className="x-ac-header t-hea">
        <h4>Subscription </h4>
        <NavMobile />
      </div>
      <div
        className="clx-cl-co i-dx"
        style={{ display: tagLine == 2 ? "none" : "block" }}
      >
        <ClassInfoIn
          dataInfo={filteredClass}
          isClassSelected={isClassSelected}
          search={searchQuery}
          handleInputs={handleSearchValue}
          selectedClass={selectedClasses}
          handleSelection={handleSelection}
        />
      </div>
      <div className="clx-cl-co ">
        <PaymentIn
          style={{ display: tagLine <= 1 ? "none" : "none" }}
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
          style={tagLine < 2 ? { display: "block" } : { display: "none" }}
          className="proceedBtn"
        >
          {tagLine < 2 && "Proceed"}
        </button>
      </div>
    </section>
  );
});

export default Subscription;
