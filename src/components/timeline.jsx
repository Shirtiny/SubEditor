// import React, { Component } from "react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import WF from "../waveform";
import logger from "../utils/logger";
import videoService from "../services/videoService";

const TimeWrapper = styled.div`
  //底部时间轴 固定150px
  height: 150px;
  position: relative;
  display: flex;
  width: 100%;
  background-color: #c0d9d9;
  // border-top: 1px solid rgb(10, 10, 10);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);

  .waveform {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    user-select: none;
    pointer-events: none;
  }
`;

let wf = null;
const Waveform = React.memo(
  ({ player, src, setFileSize }) => {
    const $waveform = React.createRef();

    useEffect(() => {
      if (wf) wf.destroy();

      wf = new WF({
        container: $waveform.current,
        mediaElement: player.video,
        backgroundColor: "rgb(20, 23, 38)",
        waveColor: "rgba(255, 255, 255, 0.1)",
        progressColor: "rgba(255, 255, 255, 0.5)",
        gridColor: "rgba(255, 255, 255, 0.05)",
        rulerColor: "rgba(255, 255, 255, 0.5)",
      });

      wf.on("fileSize", setFileSize);
      console.log(player.video, player.video.src);
      if (player.video.src) {
        videoService.sleep(1000).then(() => {
          console.log(player.video, player.video.src);
          wf.load(player.video.src);
        });
      }
    }, [player, $waveform, src, setFileSize]);
    return <div className="waveform" ref={$waveform} />;
  },
  (prevProps, nextProps) => prevProps.src === nextProps.src
);

// class Timeline extends Component {
//   wave = null;

//   componentDidUpdate() {}
//   render() {
// const { player } = this.props;
// if (this.wave) {
//   this.wave.destroy();
// }
// if (player && player.video && player.video.src) {
//   logger.clog(player.video, player.video.src);
//   this.wave = new WF({
//     container: document.querySelector("#wave"),
//     mediaElement: player.video,
//     backgroundColor: "rgb(20, 23, 38)",
//     waveColor: "rgba(255, 255, 255, 0.1)",
//     progressColor: "rgba(255, 255, 255, 0.5)",
//     gridColor: "rgba(255, 255, 255, 0.05)",
//     rulerColor: "rgba(255, 255, 255, 0.5)",
//   });
//   videoService.sleep(1000).then(() => {
//     this.wave.load(player.video.src);
//   });
// }

//     return (
//       <TimeWrapper>
//         <div id="wave" className="waveform"></div>
//       </TimeWrapper>
//     );
//   }
// }

// export default Timeline;

export default function (props) {
  const [fileSize, setFileSize] = useState(0);
  logger.clog(fileSize);
  if (!props.player) return <h1>null</h1>;
  return (
    <TimeWrapper>
      <Waveform
        {...props}
        setFileSize={setFileSize}
        src={props.player.video.src}
      />
    </TimeWrapper>
  );
}
