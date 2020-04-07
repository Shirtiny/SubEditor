import React from "react";
import WaveTime from "./WaveTime";


const Test = () => {
 
  return (
    <div className="container">
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
      <WaveTime />
    </div>
  );
};

export default Test;
