import React from "react";

const ClassInfo = ({
  dataInfo,
  isClassSelected,
  handleSelection,
  classItem,
  search,
  handleInputs,
}) => {
  return (
    <>
      <div className="cl-cx-info">
        <div className="search__field">
          <input
            type="text"
            placeholder="Search Course"
            onChange={handleInputs}
            value={search}
          />
          <i className="bi bi-search"></i>
        </div>
      </div>

      {/* ALL CARD ARRANGEMENT */}
      <div className="xl-row-card">
        {dataInfo?.map((cards, index) => {
          return (
            <div
              key={index}
              className={`cl-card ${
                isClassSelected(cards.index) ? "selected" : ""
              }`}
            >
              <p className="li-info">
                <span className="ca-hd">{cards.name}</span>
                <span className="price-tag">GHS {cards.price.toFixed(2)}</span>
              </p>
              <hr />

              <div className="ca-hd-desc">
                <h4 className="cd-hd desc">What to Expect?</h4>
                <span className="i-hd">{cards.description}</span>
              </div>

              <div className="applied">
                <button
                  onClick={() => handleSelection(cards.index)}
                  className="apply-btn"
                >
                  {isClassSelected(cards.index) ? "Unselect" : "Select"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* ALL CARD ARRANGEMENT */}
      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
        {dataInfo.length < 1 && "Class not available"}
      </p>
    </>
  );
};

export default ClassInfo;
