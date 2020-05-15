import React from "react";
import { Helmet } from "react-helmet";

const Test = () => {
  return (
    <div className="container">
      <Helmet>
        <title>SubEditor - 测试</title>
      </Helmet>
      <video
        id="video"
        controls
        width="900px"
        src="http://localhost:2020/friday.mp4"
      >
        <track
          default
          kind="subtitles"
          srcLang="en"
          src="http://localhost:2020/friday.vtt"
        />
      </video>
    </div>
  );
};

export default Test;
