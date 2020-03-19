import React, { Component } from "react";
import SubEditor from "./components/subEditor";
import { ToastContainer, toast } from "react-toastify";
import notifier from "./services/notyifierService";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {};
  render() {
    notifier.notify("hello",'TOP_CENTER');
    return (
      <React.Fragment>
        <ToastContainer autoClose={2000} position={toast.POSITION.TOP_LEFT} />
        <SubEditor />
      </React.Fragment>
    );
  }
}

export default App;
