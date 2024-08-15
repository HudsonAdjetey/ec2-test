import React, { memo, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../main";
import ConfirmModal from "../AlertModal/ConfirmModal";
import "../../container/style/modal.css";
import { toastError, toastSuccess } from "../toastify/toastMes";

const ScheduleModal = memo(({ handleIsOpen, closeModal }) => {
  const [scheduleForm, setScheduleForm] = useState({
    className: "",
    courseTitle: "",
    courseLink: "",
    time: "",
    date: "",
    whatsAppLink: "",
  });

  const [listContent, setListContent] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const handleInputs = (e) => {
    setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value });
  };
  const BASE = `/api/course`;
  const fetchAllClasses = useQuery({
    queryKey: ["class-all-fetch"],
    queryFn: async () => {
      const res = await api.get(`${BASE}/course-all`);
      return res.data;
    },
  });
  const [allClassName, setAllClassName] = useState([]);
  useEffect(() => {
    if (fetchAllClasses.isSuccess) {
      const classData = fetchAllClasses.data.classes;
      const newData = classData.map((item) => {
        return item.name;
      });
      setAllClassName(newData);
    }
  }, [fetchAllClasses.isSuccess]);
  const cancelConfirm = (e) => {
    setIsReady(!isReady);
  };

  const URL = `/api/course`;

  const mutation = useMutation({
    mutationFn: async (data) => {
      const dataToFetch = await api.post(`${URL}/schedule-class`, data);
      return dataToFetch;
    },
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (fetchAllClasses.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["class-all-fetch"],
        exact: true,
      });
    }
  }, [fetchAllClasses.isSuccess]);

  const handleConfirm = async () => {
    try {
      const res = await mutation.mutateAsync(scheduleForm);
      if (!res) {
        toastError("Failed");
        throw new Error("Failed to add class");
      }
      setIsReady(false);
      toastSuccess("Success");
    } catch (error) {
      console.log(error);
      toastError("Something is wrong");
      setIsReady(false);
    }
  };

  return (
    <div className="modal-container mdDx nx-mod" onClick={closeModal}>
      <div className="modContent">
        <h4 className="mod-lead">Schedule</h4>
        <p style={{ fontWeight: "500" }} className="li-info">
          Class Details
        </p>

        <div className="do-input-cl">
          <label htmlFor="nameOfTitle">Title</label>
          <input
            type="text"
            name="courseTitle"
            value={scheduleForm.courseTitle}
            onChange={handleInputs}
            id="nameOfTitle"
            required
          />
        </div>

        <div className="do-input-cl">
          <label htmlFor="courseLink">Course Link</label>
          <input
            type="url"
            id="courseLink"
            name="courseLink"
            value={scheduleForm.courseLink}
            onChange={handleInputs}
            required
          />
        </div>

        <div className="do-input-cl">
          <label htmlFor="nameOfClass">Class Name</label>
          <select name="className" id="nameOfClass" onChange={handleInputs}>
            <option value="" disabled selected>
              Select Class
            </option>
            {allClassName?.map((item, index) => {
              return (
                <option value={item} key={index}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>

        <div className="do-input-cl">
          <label htmlFor="timeSchedule">Time</label>
          <input
            type="time"
            id="timeSchedule"
            name="time"
            value={scheduleForm.time}
            onChange={handleInputs}
            required
          />
        </div>

        <div className="do-input-cl">
          <label htmlFor="dateSchedule">Date</label>
          <input
            type="date"
            id="dateSchedule"
            name="date"
            value={scheduleForm.date}
            onChange={handleInputs}
            required
          />
        </div>

        <div className="bsBtnsConfirm">
          <button onClick={cancelConfirm}>Save</button>
          <button onClick={handleIsOpen}>Cancel</button>
        </div>
      </div>
      {isReady && (
        <ConfirmModal
          msg={"Confirm to schedule"}
          cancelConfirm={cancelConfirm}
          acceptConfirm={handleConfirm}
        />
      )}
    </div>
  );
});

export default ScheduleModal;
