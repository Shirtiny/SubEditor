const _subArray = new WeakMap();
const _currentTime = new WeakMap();

class EditorState {
  constructor(subArray, currentTime) {
    _subArray.set(this, subArray);
    _currentTime.set(this, currentTime);
  }

  get subArray() {
    return _subArray.get(this);
  }

  get currentTime() {
    return _currentTime.get(this);
  }
}

export default EditorState;
