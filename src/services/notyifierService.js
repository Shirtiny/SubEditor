import { toast } from "react-toastify";

function notify(content, position) {
  toast(
    content,
    position && {
      position: toast.POSITION[position]
    }
  );
}

const notifier = {
  notify
};

export default notifier;
