import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Switch, Route } from "react-router-dom";
import SubEditor from "./components/subEditor";
import Test from "./components/test";
import notifier from "./services/notifierService";
import guider from "./services/guiderService";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {};
  render() {
    notifier.notify("hello", "top_left");
    return (
      <React.Fragment>
        <ToastContainer autoClose={3000} position={toast.POSITION.TOP_LEFT} className='toastContainerClass'/>
        <Switch>
          <Route path={guider.trackTest} component={Test} />
          <Route path={guider.subEditorPath} component={SubEditor} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
