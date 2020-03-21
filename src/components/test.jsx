import React from "react";

const Test = () => {
  return (
    <div className="container">
      <video
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
