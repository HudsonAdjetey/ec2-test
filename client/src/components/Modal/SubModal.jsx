import React, { memo } from "react";
import "../../container/style/modal.css";

const SubModal = memo(
  ({ closeModal, scheduleForm, handleInputs, handleIsOpen, cancelConfirm }) => {
    return (
      <div className="modal-container mdDx nx-mod" onClick={closeModal}>
        <div className="modContent">
          <h4 className="mod-lead">Register Student</h4>

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
            <input
              type="text"
              id="nameOfClass"
              name="className"
              value={scheduleForm.className}
              onChange={handleInputs}
              required
            />
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
      </div>
    );
  }
);

export default SubModal;
