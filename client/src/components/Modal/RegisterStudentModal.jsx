import React, { useEffect, useState } from "react";
import SelectTag from "../Model/SelectTag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "../AlertModal/ConfirmModal";
import { api } from "../../main";
import "../../container/style/modal.css";
import { toastError, toastSuccess } from "../toastify/toastMes";

const AuthURL = `/api/auth`;

const RegisterStudentModal = ({ handleClose }) => {
  const [monthFee, setMonthFee] = useState("");
  const [registerInfo, setRegisterInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    courses: [],
    month: 1,
  });

  const handleInputValue = (e) => {
    setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value });
  };
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleSelectCourses = (selectedValues) => {
    setSelectedCourses(selectedValues);
  };

  const [selectedClasses, setSelectedClasses] = useState([]);
  useEffect(() => {
    if (selectedCourses.length !== 0) {
      const item = selectedCourses.map((it) => {
        return it.value;
      });
      setSelectedClasses([...selectedClasses, ...item]);
    }
  }, [selectedCourses]);

  useEffect(() => {
    let updatedRegisterInfo = { ...registerInfo };

    if (selectedCourses.length > 0) {
      const newData = selectedCourses.map((item) => ({ name: item.value }));
      updatedRegisterInfo = {
        ...updatedRegisterInfo,
        courses: newData,
      };
    } else {
      updatedRegisterInfo.courses = [];
    }

    updatedRegisterInfo.month = Number(monthFee);

    setRegisterInfo(updatedRegisterInfo);
  }, [selectedCourses, monthFee]);

  const registerMutate = useMutation({
    mutationFn: async (data) => {
      return await api.post(`${AuthURL}/register-student`, data);
    },
  });

  const [alertModal, setAlertModal] = useState(false);

  const handleAlertModalRise = function () {
    setAlertModal(!alertModal);
  };

  const submitForm = async () => {
    if (selectedClasses.length < 1) {
      alert("Select at least one class");
      return;
    } else if (registerInfo.month == "") {
      alert("Please select the Monthly Fee");
    } else if (
      registerInfo.firstName == "" ||
      registerInfo.lastName == "" ||
      registerInfo.email == "" ||
      registerInfo.password == ""
    ) {
      // alert("All fields are required");
      toastError("All fields are required");
      return;
    }

    try {
      const res = await registerMutate.mutateAsync(registerInfo);
      toastSuccess("Success");
      setAlertModal(!alertModal);
    } catch (error) {
      console.log(error);
      toastError(error?.response?.data?.message);
      setAlertModal(!alertModal);
    }
  };
  const queryClient = useQueryClient();
  useEffect(() => {
    if (registerMutate.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["students", "Admin"],
        exact: true,
      });
    }
  }, [registerMutate.isSuccess]);

  return (
    <div className="modal-container mdDx">
      <div className="modContent">
        <h4 className="mod-lead">Register Student</h4>
        <p className="li-info">Personal Info</p>
        <div className="do-input">
          <input
            type="text"
            value={registerInfo.firstName}
            placeholder=" First Name"
            name="firstName"
            onChange={handleInputValue}
          />

          <input
            type="text"
            placeholder=" lastName"
            name="lastName"
            value={registerInfo.lastName}
            onChange={handleInputValue}
          />
        </div>
        <div className="do-input">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={registerInfo.email}
            onChange={handleInputValue}
          />
          <input type="contact" placeholder="Contact" name="Contact" />
        </div>
        <div className="do-input">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={registerInfo.password}
            onChange={handleInputValue}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={registerInfo.confirmPassword}
            onChange={handleInputValue}
          />
        </div>
        <div className="do-input">
          <input
            type="text"
            placeholder=" Address (optional)"
            name="address"
            value={registerInfo.address}
            onChange={handleInputValue}
          />
          <input
            type="text"
            placeholder="Institution (optional)"
            name="Institution"
          />
        </div>
        <p className="li-info">Class Info</p>
        <SelectTag
          initialValue={selectedCourses}
          onSelect={handleSelectCourses}
        />
        <div className="do-input">
          <input
            type="number"
            placeholder="Months"
            name="month"
            min="1"
            max="24"
            value={registerInfo.month}
            onChange={handleInputValue}
          />
        </div>

        <div className="bsBtnsConfirm">
          <button onClick={handleAlertModalRise}>Save</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      </div>
      {alertModal && (
        <ConfirmModal
          cancelConfirm={handleAlertModalRise}
          acceptConfirm={submitForm}
          msg={"Confirm to register student"}
        />
      )}
    </div>
  );
};

export default RegisterStudentModal;
