const subEditorPath = "/";
const trackTest = "/test";
// http://localhost:2020
const home = `${window.location.protocol}//${window.location.host}/`;

export function isMobile() {
  console.log("用户agent：",window.navigator.userAgent);
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}

const guideService = {
  home,
  subEditorPath,
  trackTest,
  isMobile
};

export default guideService;
