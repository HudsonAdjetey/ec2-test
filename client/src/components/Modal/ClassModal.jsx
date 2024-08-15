import React, { memo } from "react";
import "../../container/style/modal.css";
const ClassModal = memo(
  ({ handleIsOpen, cancelConfirm, handleInputs, classData }) => {
    return (
      <div className="modal-container mdDx nx-mod">
        <div className="modContent">
          <h4 className="mod-lead">Register Student</h4>
          <div className="do-input-cl">
            <label htmlFor="nameOfClass">Class Name</label>
            <input
              type="text"
              id="nameOfClass"
              value={classData.name}
              name="name"
              onChange={handleInputs}
            />
          </div>
          <div className="do-input-cl">
            <label htmlFor="admissionAssign">Admission Fee</label>
            <input
              type="number"
              id="admissionAssign"
              min={1}
              name="admission"
              value={classData.admission}
              onChange={handleInputs}
            />
          </div>

          <div className="do-input-cl">
            <label htmlFor="price">Monthly Fee (GHS)</label>
            <input
              type="number"
              id="price"
              min={1}
              name="price"
              value={classData.price}
              onChange={handleInputs}
            />
          </div>

          <div className="do-input-cl">
            <label htmlFor="subjectAssign">Description</label>
            <input
              type="text"
              id="subjectAssign"
              name="description"
              value={classData.description}
              onChange={handleInputs}
            />
          </div>

          <div className="do-input-cl">
            <label htmlFor="whatsAppLink">WhatsAppLink</label>
            <input
              type="text"
              id="whatsAppLink"
              name="whatsAppLink"
              value={classData.whatsAppLink}
              onChange={handleInputs}
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

export default ClassModal;
