import React, { Component } from "react";
import Header from "./header";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    html,
    body,
    #root {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;
        line-height: 1.5;
        height: 100%;
        overflow: hidden;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    #root {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #ccc;
        background: #66CCCC;
    }

    #nprogress .bar {
        top: 50px !important;

        .peg {
            display: none !important;
        }
    }

    ::-webkit-scrollbar {
        width: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        background-color: #666;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background-color: #ccc;
    }
`;

const Main = styled.div`
  position: relative;
  display: flex;
  flex: 1;
`;

class SubEditor extends Component {
  state = {
    videoUrl: "",
    subUrl: "",
    subArray: []
  };

  updateOneState = (stateObject) => {
    this.setState(stateObject);
    console.log("更新state：", stateObject);
  };


  render() {
    const props = {
      ...this.state,
      updateOneState: this.updateOneState
    };

    return (
      <React.Fragment>
        <GlobalStyle />
        <Header {...props} />
        <Main></Main>
      </React.Fragment>
    );
  }
}

export default SubEditor;
