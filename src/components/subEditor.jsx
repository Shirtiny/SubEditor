import React, { Component } from "react";
import Header from "./header";
import styled, { createGlobalStyle } from "styled-components";
import SubTable from "./subTable";

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
        background: #C0D9D9;
        // background: #66CCCC;
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
    subArray: [],
    //容器 装着SubTab 和 VideoPlayer
    container: {
      containerHeight: 10,
      containerWidth: 10
    }
  };

  //组件装载并渲染完成后
  componentDidMount() {
    //首次调整container的宽高
    this.resizeContainer();

    //把this.resizeContainer的引用作为参数 传到匿名函数内的setTimeout内
    function debounce(func, wait) {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
      };
    }
    //延时执行的调整
    const timeOutResize = debounce(this.resizeContainer, 500);
    // const timeOutResize = () => {
    //   let timeout;
    //   return () => {
    //     clearTimeout(timeout);
    //这里的this是访问不到的
    //     timeout = setTimeout(this.resizeContainer, 500);
    //   };
    // };
    //添加resize事件监听 窗口大小变化时自动执行this.resizeContainer
    window.addEventListener("resize", timeOutResize);
    console.log("添加resize事件监听");
  }

  //卸载组件前
  componentWillUnmount() {
    //移除添加的事件监听 不然页面切换多了会可能卡顿 ??
    // window.removeEventListener("resize", this.resizeContainer);
    // console.log("移除resize事件监听");
  }

  //调整container的宽高
  resizeContainer = () => {
    //减去导航栏的50 底部时间轴的150
    const containerHeight = document.body.clientHeight - 200;
    const containerWidth = document.body.clientWidth;
    console.log("更新container的宽高", containerWidth, containerHeight);
    this.setState({ container: { containerHeight, containerWidth } });
  };

  updateOneState = stateObject => {
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
        <Main>
          <SubTable {...props} />
        </Main>
      </React.Fragment>
    );
  }
}

export default SubEditor;
