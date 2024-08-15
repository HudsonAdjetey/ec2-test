import React, { useCallback, useState } from "react";
import ReactPaginate from "react-paginate";

const ActiveContent = ({ filteredClass, data }) => {
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredClass?.slice(itemOffset, endOffset);
  let pageCount = data ? Math.ceil(data.length / itemsPerPage) : 1;

  const handlePageClick = useCallback(
    ({ selected }) => {
      const newOffset = (selected * itemsPerPage) % data?.length;
      setItemOffset(newOffset);
    },
    [data]
  );
  return (
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
  );
};

export default ActiveContent;
