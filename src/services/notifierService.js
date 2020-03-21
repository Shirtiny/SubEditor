import { toast } from "react-toastify";

export function notify(
  content,
  positionStr = "top_left",
  typeStr = "DEFAULT",
  config = null
) {
  const postionStrUpper = (positionStr + "").toUpperCase();
  const typeStrUpper = (typeStr + "").toUpperCase();
  const toastConfig = {
    position: toast.POSITION[postionStrUpper],
    type: toast.TYPE[typeStrUpper],
    ...config
  };
  toast(content, toastConfig);
}


const notifier = {
  notify
};

export default notifier;
