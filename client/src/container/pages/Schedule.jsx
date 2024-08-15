import React, { useEffect, memo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../main";
import SubModal from "../../components/Modal/SubModal";
import ConfirmModal from "../../components/AlertModal/ConfirmModal";
import ScheduleModal from "../../components/Modal/ScheduleModal";
import AdminMobile from "../../components/NavMenu/AdminNav";
import Loader from "../../components/Preloader/Loader";
import { toastError, toastSuccess } from "../../components/toastify/toastMes";

const Schedule = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [id, setId] = useState(0);
  const [toggle, setToggle] = useState(false);
  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  const [dataList, setDataList] = useState({});
  useEffect(() => {
    // Add event listener for keydown event when modal is open
    if (isOpen || isConfirm) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
    }
    return () => {
      // Cleanup by enabling scrolling when component unmounts
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isConfirm]);

  const editToggle = (_id) => {
    setToggle(!toggle);
    setId(_id);
    const obj = listContent.find((item) => item._id == _id);
    setDataList(obj);
  };
  const toggleEditModal = () => {
    setToggle(!toggle);
  };

  const [isAlert, setIsAlert] = useState(false);
  const cancelConfirm = (index) => {
    setId(index);
    setIsConfirm(!isConfirm);
  };

  const alertConfirm = (index) => {
    setIsAlert(!isAlert);
  };

  const handleModalClose = (e) => {
    // stop propagation
    e.stopPropagation();
  };
  const [listContent, setListContent] = useState([]);

  const queryClient = useQueryClient();
  // Fetch all the data
  const URL = `/api/course`;
  const query = useQuery({
    queryKey: ["schedule-all"],
    queryFn: async () => {
      const res = await api.get(`${URL}/schedule-fetch`);
      return res.data;
    },
  });

  const updateData = useMutation({
    mutationFn: async (updatedCourse) => {
      const response = await api.put(
        `${URL}/schedule-update/${id}`,
        updatedCourse
      );
      return response;
    },
  });

  const deleteData = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`${URL}/schedule-remove/${id}`);
      return res;
    },
  });

  const sendRequest = async () => {
    try {
      const res = await updateData.mutateAsync(dataList);

      if (updateData.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["schedule-all"] });
      }
      setIsAlert(!isAlert);
      setToggle(!toggle);
      toastSuccess("Updated");
    } catch (error) {
      console.log(error);
      setIsAlert(!isAlert);
      toastError("Failed");
      return error.message;
    }
  };
  useEffect(() => {
    if (updateData.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["schedule-all"] });
    }
  }, [updateData, dataList]);

  const confirmDelete = async () => {
    try {
      const res = await deleteData.mutateAsync();

      if (deleteData.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["schedule-all"] });
      }
      setIsConfirm(false);
    } catch (error) {
      setIsConfirm(false);
      toastError("Failed");
    }
    toastSuccess("Success");
  };

  queryClient.invalidateQueries({
    queryKey: ["schedule-all"],
    exact: true,
  });

  useEffect(() => {
    if (query.data && query.isSuccess) {
      const dataFetched = query.data;
      setListContent(dataFetched);
    }
  }, [query.data]);

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
  const handleEditInputs = (e) => {
    setDataList({ ...dataList, [e.target.name]: e.target.value });
  };

  const handleSelectCourses = (selectedValues) => {
    setSelectedCourses(selectedValues);
  };

  return (
    <div className="x-t-pages">
      <div className="x-ac-header t-hea">
        <h4>Schedule </h4>
        <AdminMobile />
      </div>
      <div className="active-content tab-co-mod">
        <div className="bt-content ">
          <button style={{ height: "40px" }} onClick={handleIsOpen}>
            Create Schedule
          </button>
        </div>
        <div className="stdTable">
          <table className="content_table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Class Name</th>
                <th>Time</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(
                listContent?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.courseTitle}</td>
                      <td>{item.className}</td>
                      <td>{item.time}</td>
                      <td>{formatDateWithSuffix(item.date)}</td>

                      <td className="t-lin">
                        <span onClick={() => editToggle(item._id)}>Edit</span>
                        <span onClick={() => cancelConfirm(item._id)}>
                          Delete
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {toggle && (
          <SubModal
            scheduleForm={dataList}
            handleInputs={handleEditInputs}
            cancelConfirm={alertConfirm}
            handleIsOpen={toggleEditModal}
          />
        )}

        {isAlert && (
          <ConfirmModal
            msg={"Confirm to update"}
            cancelConfirm={alertConfirm}
            acceptConfirm={sendRequest}
          />
        )}

        {isOpen && (
          <ScheduleModal
            handleIsOpen={handleIsOpen}
            handleModalClose={handleModalClose}
          />
        )}

        {isConfirm && (
          <ConfirmModal
            msg={"Confirm to delete"}
            acceptConfirm={confirmDelete}
            cancelConfirm={cancelConfirm}
          />
        )}
      </div>
    </div>
  );
});

export default Schedule;
