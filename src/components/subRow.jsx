import React from "react";

const SubRow = props => {
  return (
    <div
      key={props.index}
      style={props.style}
      className={[props.className, props.index % 2 ? "odd" : ""].join(" ")}
    >
      <div className="rowT" style={{ width: 50 }}>
        {props.index}
      </div>
      <div className="rowT" style={{ width: 100 }}>
        {props.rowData.startTime}
      </div>
      <div className="rowT" style={{ width: 100 }}>
        {props.rowData.endTime}
      </div>
      <div className="rowT" style={{ width: 100 }}>
        {props.rowData.length}
      </div>
      <div className="rowT" style={{ flex: 1 }}>
        {props.rowData.content}
      </div>
      <div className="rowT" style={{ width: 90 }}>
        操作
      </div>
    </div>
  );
};

export default SubRow;
