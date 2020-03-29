import { toast } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";

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
  isActive,
  done
};

export default notifier;
