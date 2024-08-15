import React, { useEffect, useState } from "react";
import { images } from "../../constants/images";

const PaymentIn = ({
  tagLine,
  active,
  activeTabToggler,
  totalAmount,
  selectedClass,
  handlePayment,
}) => {
  const [admission, setAdmission] = useState(0);
  useEffect(() => {
    if (selectedClass?.length > 0) {
      let sum = 0;
      for (let i of selectedClass) {
        if (isNaN(i.admission)) {
          i.admission = 0;
        }
        sum += Number(+i.admission);
      }
      setAdmission(sum);
    }
  }, [selectedClass]);
  return (
    <div className={` py-i-main ${tagLine === 2 ? "activeTab" : "unActive"}`}>
      <div className="cx--content i-dy">
        <div className="svg--bg">
          <img src={images.pay} alt="" />
        </div>

        <div className="payment__content">
          <h4 style={{ textAlign: "center" }}>Payment Details</h4>

          <span className="tr__text">What's your requirement? </span>
          <div className="select__mode">
            <div
              className={`month ${active == 1 ? "tabSelect" : ""}`}
              onClick={() => activeTabToggler(1)}
            >
              <p className="h-title"> Bill Monthly </p>
              <h1 className="leadText">30</h1>
              <span className="day">Days</span>
            </div>

            <div
              className={`month ${active == 2 ? "tabSelect" : ""}`}
              onClick={() => activeTabToggler(2)}
            >
              <p className="h-title"> Bill Every 3 Months </p>
              <h1 className="leadText">90</h1>
              <span className="day">Days</span>
            </div>
          </div>

          <div className="checkout__content">
            <h4>Check Out</h4>
            <div className="summary">
              {selectedClass?.map((item, index) => {
                return (
                  <div key={index}>
                    <p className="item__list">
                      <span>{item.name}</span>
                      <span>
                        GHS{" "}
                        {active == 1
                          ? Number(+item.price * 1)
                          : Number(+item.price * 3)}
                      </span>
                    </p>
                  </div>
                );
              })}
              <div className="totalAmounts bill__month">
                <span>Total Amounts:</span>
                <span className="tAmount">GHS {totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pBtn">
            <button onClick={handlePayment}>Pay Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentIn;
