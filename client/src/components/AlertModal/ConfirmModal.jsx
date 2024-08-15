import React from "react";

const ConfirmModal = ({ cancelConfirm, acceptConfirm, msg }) => {
  return (
    <div className="modalContainer-se">
      <div className="modContent-se">
        <p className="alert__message">{msg}</p>
        <div className="delete__confirm">
          <button onClick={acceptConfirm}>Confirm</button>
          <button onClick={cancelConfirm}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
