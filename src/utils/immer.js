import produce from "immer";

export function copy(obj, fn) {
  return produce(obj, fn);
}

const immer = {
  copy,
};

export default immer;
