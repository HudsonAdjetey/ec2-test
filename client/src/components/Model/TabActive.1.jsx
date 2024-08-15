import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { api } from "../../main";
import StudentModal from "../Modal/StudentModal";
import StudentTable from "./StudentTable";
import RegisterStudentModal from "../Modal/RegisterStudentModal";
import Loader from "../Preloader/Loader";
import { toastError, toastSuccess } from "../toastify/toastMes";

const TabActive = () => {
  const [selectedId, setSelectedId] = useState(0);
  const [data, setData] = useState([]);
  const URL = `/api/course`;
  const queryData = useQuery({
    queryKey: ["students", "Admin"],
    queryFn: async () => {
      const fetchedData = await api.get(`${URL}/all-students`);
      return fetchedData.data;
    },
  });
  const [indStudent, setIndStudent] = useState({});
  const [toggleOpen, setToggleOPen] = useState(false);
  const [id, setID] = useState(null);
  const editToggle = (clickedIndex, index) => {
    if (!index) return;
    setToggleOPen(!toggleOpen);
    const dataFe = queryData?.data?.data;
    setSelectedId(index);
    setID(clickedIndex);
    // find the student
    if (dataFe) {
      const newItem = dataFe.find((item) => index === item.indexId);
      // If newItem is found, update dataForm
      if (newItem) {
        setIndStudent({ ...indStudent, newItem });
      }
    }
  };
  const cancelToggle = () => {
    setSelectedId(0);
  };
  useEffect(() => {
    if (queryData.isSuccess) {
      const findData = data.filter((cl) => cl.index == selectedId);
      setIndStudent(findData);
    }
  }, [queryData.isSuccess]);
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
  useEffect(() => {
    if (queryData.data && queryData.isSuccess) {
      const dataFetched = queryData.data.data.sort((a, b) =>
        a.firstName > b.firstName ? 1 : -1
      );
      setData(dataFetched);
    }
  }, [queryData]);

  const [filteredClass, setFilteredClass] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (!data) {
      return;
    }
    const filterClass = data
      .filter((cls) => {
        if (searchQuery == "") {
          return true;
        } else if (
          cls.courseName.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return true;
        }
        return false;
      })
      .sort((a, b) => a.courseName.localeCompare(b.courseName));
    setFilteredClass(filterClass);
  }, [searchQuery, data, queryData.isSuccess]);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 50;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredClass?.slice(itemOffset, endOffset);
  let pageCount = data ? Math.ceil(data.length / itemsPerPage) : 1;

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data?.length;
    setItemOffset(newOffset);
  };
  /* HANDLE SUSPEND */
  const suspendMutation = useMutation({
    mutationKey: ["SuspendUser"],
    mutationFn: async () => {
      const res = await api.patch(`${URL}/suspend-refetch/${selectedId}`);
      return res;
    },
  });
  const handleSuspendAccount = async () => {
    try {
      const suspend = await suspendMutation.mutateAsync();

      setToggleOPen(!toggleOpen);
      toastSuccess("Success");
    } catch (error) {
      setToggleOPen(!toggleOpen);
      setSelectedId(null);
      toastError("Something went wrong");
      console.log(error);
    }
  };
  const [isHide, setHide] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (suspendMutation.isSuccess) {
      // invalidate
      queryClient.invalidateQueries({
        queryKey: ["students", "Admin"],
        exact: true,
      });
    }
  }, [suspendMutation.isSuccess]);
  /* HANDLE SUSPEND */

  const [isModal, setIsModal] = useState(false);

  const handleIsModal = () => {
    setIsModal(!isModal);
  };
  return (
    <div className="active-content tab-co-mod">
      {queryData.isLoading && <Loader />}
      <div className="bt-content flex-bt-content">
        <div className="c_t">
          <span>Total </span>
          <span>{currentItems.length}</span>
        </div>
        <div className="bt-ct">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleIsModal}>New Student</button>
        </div>
      </div>
      {/* STUDENT TABLE */}
      <StudentTable
        currentItems={currentItems}
        editToggle={editToggle}
        formatDateWithSuffix={formatDateWithSuffix}
      />
      {/* STUDENT TABLE */}

      {selectedId && (
        <StudentModal
          handleSuspend={handleSuspendAccount}
          handleClose={cancelToggle}
          id={selectedId}
          crID={id}
          initialValue={indStudent}
          toggleOPen={toggleOpen}
          setToggleOpen={setToggleOPen}
        />
      )}
      {isModal && <RegisterStudentModal handleClose={handleIsModal} />}

      {data && (
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
  );
};
export default TabActive;
