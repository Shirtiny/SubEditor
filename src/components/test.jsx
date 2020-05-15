import React from "react";
import { Helmet } from "react-helmet";
import config from "../config/config.json"
import guideService from "../services/guideService"

const Test = () => {
  return (
    <div className="container">
      <Helmet>
        <title>{config.test_title}</title>
      </Helmet>
      <video
        id="video"
        controls
        width="900px"
        src={`${guideService.home}friday.mp4`}
      >
        <track
          default
          kind="subtitles"
          srcLang="en"
          src={`${guideService.home}friday.vtt`}
        />
      </video>
    </div>
  );
};

export default Test;
