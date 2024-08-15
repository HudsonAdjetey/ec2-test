import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { api } from "../../../main";

const TabAll = () => {
  const [data, setData] = useState([]);
  const URL = `/api/course`;
  const queryStudent = useQuery({
    queryKey: ["studentsAll", "Admin"],
    queryFn: async () => {
      const fetchedData = await api.get(`${URL}/studentsDb`);
      return fetchedData.data;
    },
  });

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
    if (queryStudent.data && queryStudent.isSuccess) {
      const dataFetched = queryStudent.data.data.sort((a, b) =>
        a.firstName > b.firstName ? 1 : -1
      );
      setData(dataFetched);
    }
  }, [queryStudent]);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 50;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = data?.slice(itemOffset, endOffset);
  let pageCount = data ? Math.ceil(data.length / itemsPerPage) : 1;

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data?.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="active-content">
      <div className="stdTable">
        <table className="content_table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <img src={item.profile} alt="" />
                  </td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
    </div>
  );
};

export default TabAll;
