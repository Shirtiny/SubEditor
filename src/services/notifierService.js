import { toast } from "react-toastify";

export function notify(content, positionStr) {
  const positionConfig = translatePosition(positionStr);
  toast(content, positionConfig);
}

export function notifyDiv(content, config) {
  toast(content, config);
}

export function error(content, positionStr) {
  const positionConfig = translatePosition(positionStr);
  toast.error(content, positionConfig);
}

//@positionStr 如：top_center
function translatePosition(positionStr) {
  const postionStrUpper = (positionStr + "").toUpperCase();
  let positionConfig = postionStrUpper && {
    position: toast.POSITION[postionStrUpper]
  };
  return positionConfig;
}

const notifier = {
  notify,
  error,
  notifyDiv
};

export default notifier;
