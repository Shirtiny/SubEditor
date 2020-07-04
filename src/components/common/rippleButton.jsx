import React, { useCallback } from "react";
import styled from "styled-components";

const RippleButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  user-select: none;
  position: relative;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  box-shadow: 2px 1px 3px rgba(0, 0, 0, 0.2);

  .rippleSpan {
    display: block;
    position: absolute;
    border-radius: 100%;
    background: rgba(255, 255, 255, 0.5);
    transform: scale(0);
  }

  .rippleAnimation {
    animation: ripple 0.5s ease-in;
  }

  .btnMouseDown {
    opacity: 0.5;
  }
`;

const RippleButton = ({
  disabled,
  height,
  width,
  bgColor,
  label,
  color,
  onClick,
  title,
  className,
  element,
}) => {
  const rippleBtnBoxRef = useCallback(
    (node) => {
      if (node !== null && !disabled) {
        //鼠标进入
        node.onmouseenter = function (event) {
          let ripple = node.querySelector(".rippleSpan");
          ripple.classList.add("rippleAnimation");
          ripple.style.width = this.offsetWidth + "px";
          ripple.style.height = this.offsetWidth + "px";
          ripple.style.top = -(this.offsetHeight - event.offsetY) + "px";
          ripple.style.left = -(this.offsetWidth / 2 - event.offsetX) + "px";
          setTimeout(function () {
            ripple.classList.remove("rippleAnimation");
          }, 500);
        };
        //鼠标点下
        node.onmousedown = function (e) {
          this.style.opacity = 0.7;
          this.style.boxShadow = "0px 0px 0px rgba(0, 0, 0, 0.2)";
        };
        //鼠标松开
        node.onmouseup = function (e) {
          this.style.opacity = "";
          this.style.boxShadow = "";
        };
        //设置属性
        node.setAttribute("shtitle", title);
      }
    },
    [disabled,title]
  );

  return (
    <RippleButtonWrapper
      ref={rippleBtnBoxRef}
      onClick={onClick}
      style={{
        width,
        height,
        color,
        backgroundColor: bgColor,
      }}
      className={`${className} ${title && "shToolTip"}`}
    >
      <span className="rippleSpan"></span>
      {label}
      {element}
    </RippleButtonWrapper>
  );
};

export default RippleButton;
