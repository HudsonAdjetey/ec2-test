import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import ConfirmModal from "../AlertModal/ConfirmModal";
import { api } from "../../main";
const URL = `/api/course`;
import "../../container/style/modal.css";
import { toastError, toastSuccess } from "../toastify/toastMes";

const StudentModal = ({
  id,
  crID,
  initialValue,
  handleSuspend,
  handleClose,
}) => {
  const [data, setData] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  // Add a state variable to control the date input value
  const [subscriptionEnd, setSubscriptionEnd] = useState(
    data?.newItem?.subscriptionEnd || ""
  );
  // Update the handleInputChange function to use setSubscriptionEnd
  const handleInputChange = (e) => {
    setSubscriptionEnd(e.target.value);
    const updatedData = {
      ...data,
      newItem: {
        ...data.newItem,
        subscriptionEnd: e.target.value,
      },
    };
    setData(updatedData);
  };

  // Update the date input to use the controlled value

  const [alertModal, setAlertModal] = useState(false);

  const handleAlertModalRise = function () {
    setAlertModal(!alertModal);
  };

  const [stdID, setStdID] = useState();
  const [bodyForm, setBodyForm] = useState({});
  useEffect(() => {
    if (id) {
      setStdID(data?.newItem?.indexId);
      setBodyForm({
        subscriptionEnd: data.newItem.subscriptionEnd,
        id: crID,
      });
    }
  }, [data]);
  // submit update
  const updateExpiry = useMutation({
    mutationFn: async (details) => {
      return await api.patch(`${URL}/student-update/${id}`, details);
    },
  });
  const submitUpdate = async () => {
    if (stdID == undefined) {
      toastError("Something went wrong");
      return;
    }
    try {
      const res = await updateExpiry.mutateAsync(bodyForm);
      handleClose();
      toastSuccess("Success");
      setAlertModal(!alertModal);
    } catch (error) {
      setAlertModal(!alertModal);
      toastError("Failed");
    }
  };
  const queryClient = useQueryClient();
  useEffect(() => {
    if (updateExpiry.isSuccess) {
      // invalidate
      queryClient.invalidateQueries({
        queryKey: ["students", "Admin"],
        exact: true,
      });
    }
  }, [updateExpiry.isSuccess]);

  return (
    <div className="modal-container">
      <div className="modContent">
        <div className="info-paten">
          <span className="s-ri">Student Name</span>
          <span className="s-li">
            {data?.newItem?.lastName} {data?.newItem?.firstName}{" "}
          </span>
        </div>

        <div className="info-paten">
          <span className="s-ri">Email Address</span>
          <span className="s-li">{data?.newItem?.email}</span>
        </div>

        <div className="info-paten">
          <span className="s-ri">Subscription Date</span>
          <span className="s-li">
            {new Date(data?.newItem?.subscription).toUTCString()}
          </span>
        </div>

        <div className="info-paten">
          <span className="s-ri">Expiry Date Date</span>
          <span className="s-li">
            {isEditing ? (
              <div>
                <input
                  type="date"
                  value={subscriptionEnd}
                  onChange={handleInputChange}
                />
                <button className="svBtn" onClick={handleEditClick}>
                  Save
                </button>
              </div>
            ) : (
              <p className="s-li-edit">
                <span>
                  {new Date(data?.newItem?.subscriptionEnd).toUTCString()}
                </span>
                <i
                  onClick={() => handleEditClick()}
                  className="bi bi-pen-fill"
                ></i>
              </p>
            )}
          </span>
        </div>
        <button className="suspendBtn" onClick={handleSuspend}>
          {data?.newItem?.verified == true ? "Suspend" : "Activate"}
        </button>
        <div className="bsBtnsConfirm">
          <button onClick={handleAlertModalRise}>Save</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      </div>
      {alertModal && (
        <ConfirmModal
          cancelConfirm={handleAlertModalRise}
          acceptConfirm={submitUpdate}
          msg={"Confirm to accept changes"}
        />
      )}
    </div>
  );
};

export default StudentModal;
