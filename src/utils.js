
function range(start, end) {
  let n;
  if (end === undefined) {
    n = start;
    start = 0;
  } else if (start <= end) {
    n = end - start;
  } else {
    throw new Error("start > end");
  }

  return [...Array(n).keys()].map((i) => i + start);
}

export {range};