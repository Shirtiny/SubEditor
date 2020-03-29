import React from "react";
import { toast } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import BootstrapToast from "../components/common/bootstrapToast";

export const transitions = {
  slide: Slide,
  zoom: Zoom,
  flip: Flip,
  bounce: Bounce
};

export function notify(
  content,
  positionStr = "top_left",
  typeStr = "DEFAULT",
  config = null,
  transition = "bounce"
) {
  const postionStrUpper = (positionStr + "").toUpperCase();
  const typeStrUpper = (typeStr + "").toUpperCase();
  const toastConfig = {
    position: toast.POSITION[postionStrUpper],
    type: toast.TYPE[typeStrUpper],
    // hideProgressBar: true,
    transition: transitions[transition],
    ...config
  };
  return toast(content, toastConfig);
}

//bootstrap样式的toast 需要一个字符串数组
export function bootstrapToast(
  strArray,
  type = "warning",
  position = "top_left",
  config,
  transition = "zoom"
) {
  return notify(
    <BootstrapToast head="请检查输入格式" dataArray={strArray} type={type} />,
    position,
    "default",
    config,
    transition
  );
}

//对应id的toast正在工作 则返回true 否则返回false
export function isActive(toastId) {
  return toast.isActive(toastId);
}

//关闭一个提示
export function done(toastId) {
  return toast.done(toastId);
}

const notifier = {
  notify,
  bootstrapToast,
  isActive,
  done
};

export default notifier;
