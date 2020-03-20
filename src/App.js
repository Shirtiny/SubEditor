import React, { Component } from "react";
import SubEditor from "./components/subEditor";
import { ToastContainer, toast } from "react-toastify";
import notifier from "./services/notifierService";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {};
  render() {
    notifier.notify("hello", "top_left");
    return (
      <React.Fragment>
        <ToastContainer autoClose={3000} position={toast.POSITION.TOP_LEFT} />
        <SubEditor />
      </React.Fragment>
    );
  }
}

export default App;
