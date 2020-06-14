const history = [];
let top = -1;

export function push(editorState) {
  top++;
  if (top < history.length) {
    history[top] = editorState;
    history.length = top + 1;
    return history.length;
  } else {
    return history.push(editorState);
  }
}

export function pop() {
  if (top >= 1) return history[--top];
  throw new Error("已到栈底");
}

export function unPop() {
  if (top + 1 < history.length) {
    top++;
    return history[top];
  } else throw new Error("已到栈顶");
}

export function getTop() {
  return top;
}

export function getHistory() {
  return history;
}

const editorStateService = {
  push,
  pop,
  unPop,
  getTop,
  getHistory,
};

export default editorStateService;
