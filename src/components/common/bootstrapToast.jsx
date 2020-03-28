import React from "react";

const BootstrapToast = ({ head, small, dataArray, type }) => {
  const typeList = {
    primary: "#007aff",
    warning: "#ff8300"
  };
  return (
    <div
      className="toast show"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        border: "none",
        boxShadow: "none"
      }}
    >
      <div className="toast-header">
        <svg
          className="rounded mr-2"
          width="15"
          height="15"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill={typeList[type]}></rect>
        </svg>
        <strong className="mr-auto">{head}</strong>
        <small>{small || '提示'}</small>
      </div>
      <div className="toast-body">
        <ul className="list-group list-group-flush">
          {dataArray.map(value => (
            <li className="list-group-item" key={value}>
              {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BootstrapToast;
