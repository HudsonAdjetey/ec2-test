import React, { useEffect, useState, useMemo } from "react";
import NavMobile from "../../components/NavMenu/NavMobile";
import ReactPaginate from "react-paginate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../main";
import ClassModal from "../../components/Modal/ClassModal";
import { useSelector } from "react-redux";
import ConfirmModal from "../../components/AlertModal/ConfirmModal";
import SubClassModal from "../../components/Modal/SubClassModal";
import AdminMobile from "../../components/NavMenu/AdminNav";
import Loader from "../../components/Preloader/Loader";
import { toastError, toastSuccess } from "../../components/toastify/toastMes";

const Classes = () => {
  const { user } = useSelector((state) => state.user);
  const [isAlert, setIsAlert] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [listData, setListData] = useState({});
  const [alertPop, setAlertPop] = useState(false);

  const [filteredClass, setFilteredClass] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 50;
  const [classData, setClassData] = useState([]);

  const URL = `/api/course`;
  const queryClient = useQueryClient();

  const [addList, setAddList] = useState({
    name: "",
    admission: "",
    monthFee: "",
    description: "",
    price: "",
    whatsAppLink: "",
  });
  const [id, setId] = useState(0);

  const addMutate = useMutation({
    mutationFn: async (data) => {
      const res = await api.post(`${URL}/course-registration`, data);
      return res;
    },
  });
  const [deleteToggle, setDeleteToggle] = useState(false);

  const queryFunction = useQuery({
    queryKey: ["class-all-fetched"],
    queryFn: async () => {
      const allClasses = await api.get(`${URL}/course-all`);
      return allClasses;
    },
  });

  useEffect(() => {
    if (queryFunction.isSuccess) {
      const data = queryFunction.data.data.classes;
      setClassData(data);
    }
  }, [queryFunction.data]);

  useEffect(() => {
    if (!classData) {
      return;
    }
    const filterClass = classData
      .filter((cls) => {
        if (searchQuery === "") {
          return true;
        } else if (cls.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        return false;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    setFilteredClass(filterClass);
  }, [searchQuery, classData, queryFunction.isSuccess]);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredClass?.slice(itemOffset, endOffset);
  let pageCount = classData ? Math.ceil(classData.length / itemsPerPage) : 1;

  // Memoize event handlers using useMemo
  const handlePageClick = useMemo(
    () => (event) => {
      const newOffset = (event.selected * itemsPerPage) % classData?.length;
      setItemOffset(newOffset);
    },
    [classData, itemsPerPage]
  );

  const editToggle = useMemo(
    () => (_id) => {
      setToggle(!toggle);
      setId(_id);
      const obj = classData.find((item) => item._id == _id);
      setListData({ ...obj, userID: user.userID });
    },
    [classData, toggle, user.userID]
  );

  const handleEditInputs = useMemo(
    () => (e) => {
      setListData({
        ...listData,
        [e.target.name]: e.target.value,
      });
    },
    [listData]
  );

  const handleIsOpen = useMemo(
    () => () => {
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

  const showPop = useMemo(
    () => () => {
      setAlertPop(!alertPop);
    },
    [alertPop]
  );

  const toggleEditModal = useMemo(
    () => () => {
      setToggle(!toggle);
    },
    [toggle]
  );

  const alertConfirm = useMemo(
    () => (index) => {
      setIsAlert(!isAlert);
    },
    [isAlert]
  );

  const handleValueAddInputs = useMemo(
    () => (e) => {
      setAddList({ ...addList, [e.target.name]: e.target.value });
    },
    [addList]
  );

  const addSubmit = useMemo(
    () => async () => {
      try {
        if (addList.description === "") {
          toastError("Description is required!");
          return false;
        }
        if (!addList.price) {
          toastError("Add an amount");
          return false;
        }
        if (addList.name == "") {
          toastError("Name cannot be empty");
          throw new Error("Name cannot be empty");
        }
        const re = await addMutate.mutateAsync(addList);
        console.log(re);
        if (re) {
          setAddList({
            name: "",
            admission: "",
            monthFee: "",
            description: "",
            whatsAppLink: "",
            price: "",
          });
        }
        setAlertPop(!alertPop);
        toastSuccess("Success");
        setIsOpen(!isOpen);
      } catch (error) {
        setAlertPop(!alertPop);
        console.log(error);
        toastError("Something went wrong");
      }
    },
    [addList, addMutate, alertPop, isOpen]
  );

  // EDIT MODE
  const queryEdit = useMutation({
    mutationKey: ["edit-class", listData._id],
    mutationFn: async (newInfo) => {
      const res = await api.put(`${URL}/course-update/${id}`, newInfo);
      return res;
    },
  });

  useEffect(() => {
    if (addMutate.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["class-all-fetched"],
        exact: true,
      });
    }
  }, [addMutate]);

  const confirmEdit = async () => {
    try {
      const res = await queryEdit.mutateAsync(listData);
      if (res) {
        setIsAlert(!isAlert);
        setToggle(!toggle);
        toastSuccess("Success");
      }
    } catch (error) {
      console.log(error.message);
      toastError("Something went wrong");
      return error;
    }
  };

  const [deleteId, setDeleteId] = useState(0);

  const mutateDelete = useMutation({
    mutationKey: "delete-class",
    mutationFn: async (_id) => {
      const res = await api.delete(`${URL}/course-delete/${_id}`);
      return res;
    },
  });

  const toggleDelete = (id) => {
    setDeleteId(id);
    setDeleteToggle(!deleteToggle);
  };
  const confirmCancelDelete = () => {
    setDeleteToggle(!deleteToggle);
  };
  const submitDelete = async () => {
    try {
      await mutateDelete.mutateAsync(deleteId);
      setDeleteToggle(!deleteToggle);
      toastSuccess("Success");
    } catch (error) {
      setDeleteToggle(!deleteToggle);
      toastError("Failed");
      console.log(error?.message || error);
    }
  };

  useEffect(() => {
    if (mutateDelete.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["class-all-fetched"],
        exact: true,
      });
    }
  }, [mutateDelete]);

  useEffect(() => {
    if (queryEdit.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["class-all-fetched"],
        exact: true,
      });
    }
  }, [queryEdit]);
  return (
    <div className="x-t-pages">
      {queryEdit.isPending && <Loader />}
      {addMutate.isPending && <Loader />}
      {queryFunction.isLoading && <Loader />}
      <div className="x-ac-header t-hea">
        <h4>Classes </h4>
        <AdminMobile />
      </div>
      <div className="active-content tab-co-mod">
        <div className="bt-content ">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleIsOpen}>New Class</button>
        </div>
        <div className="stdTable">
          <table className="content_table">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Admission Fee</th>
                <th>Month Fee</th>
                <th>Desc</th>
                <th>WhatsApp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>GHS {item.admission?.toFixed(2)}</td>
                    <td>GHS {item.price?.toFixed(2)}</td>
                    <td>{item.description}</td>
                    <td>{!item?.whatsAppLink ? "---" : item.whatsAppLink}</td>
                    <td className="t-lin">
                      <span onClick={() => editToggle(item._id)}>Edit</span>
                      <span onClick={() => toggleDelete(item._id)}>Delete</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {isOpen && (
          <ClassModal
            handleIsOpen={handleIsOpen}
            cancelConfirm={showPop}
            handleInputs={handleValueAddInputs}
            classData={addList}
          />
        )}
        {alertPop && (
          <ConfirmModal
            msg={"Confirm to create class"}
            cancelConfirm={showPop}
            acceptConfirm={addSubmit}
          />
        )}

        {toggle && (
          <SubClassModal
            handleIsOpen={toggleEditModal}
            cancelConfirm={alertConfirm}
            data={listData}
            handleInputs={handleEditInputs}
          />
        )}

        {isAlert && (
          <ConfirmModal
            msg={"Confirm to update"}
            cancelConfirm={alertConfirm}
            acceptConfirm={confirmEdit}
          />
        )}

        {deleteToggle && (
          <ConfirmModal
            msg={"Confirm to delete"}
            cancelConfirm={confirmCancelDelete}
            acceptConfirm={submitDelete}
          />
        )}

        {classData.length > 0 && (
          <ReactPaginate
            breakLabel="..."
            nextLabel="next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={Number(pageCount)}
            previousLabel="previous"
            renderOnZeroPageCount={null}
            activeLinkClassName="active"
            nextLinkClassName="page-num"
            previousLinkClassName="page-num"
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(Classes);
