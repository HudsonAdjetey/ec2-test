import React from "react";

const StudentTable = ({ currentItems, editToggle, formatDateWithSuffix }) => {
  return (
    <div className="stdTable">
      <table className="content_table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Class</th>
            <th>Subscription Date</th>
            <th>Expiry Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems?.map((item, index) => (
            <TableRow
              key={index}
              item={item}
              editToggle={editToggle}
              formatDateWithSuffix={formatDateWithSuffix}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ item, editToggle, formatDateWithSuffix }) => {
  return (
    <tr>
      <td>
        <img src={item.profile} alt={item.firstName} loading="lazy" />
      </td>
      <td>{item.firstName + " " + item.lastName}</td>
      <td>{item.courseName}</td>
      <td>{formatDateWithSuffix(item.subscription)}</td>
      <td>{formatDateWithSuffix(item.subscriptionEnd)}</td>
      <td>
        <span onClick={() => editToggle(item.index, item.indexId)}>Edit</span>
      </td>
    </tr>
  );
};

export default StudentTable;
