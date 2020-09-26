import $ from "jquery";

function draw_grid(canvas, unit, margin) {
  let height = canvas.height - 2 * margin;
  let width = canvas.width - 2 * margin;

  let ctx = canvas.getContext("2d");
  ctx.save();
  ctx.transform(1, 0, 0, 1, margin, margin);
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 0.5;

  // diagonal
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(width, 0);
  ctx.stroke();

  // vertical lines
  ctx.setLineDash([1, 4]);
  for (let i = 0; i <= width; i += unit) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }

  // horizontal lines
  for (let j = 0; j <= height; j += unit) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(width, j);
    ctx.stroke();
  }
  ctx.restore();
}

function draw_path(canvas, w, unit, margin) {
  let ctx = canvas.getContext("2d");
  let x = 0;
  let y = 0;

  ctx.save();

  // flip to the sane way of looking at Cartesian coordinates
  ctx.transform(1, 0, 0, -1, 0, canvas.height);
  ctx.transform(1, 0, 0, 1, margin, margin); // create margin

  // path
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let s of w) {
    if (s) {
      y += unit;
    } else {
      x += unit;
    }
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

/*
 * make div and draw dyck word and everything
 */
function make_path(path, unit = 20, margin = 5) {
  let w = path[0];
  let area = path[1];
  let dinv = path[2];

  const n = Math.floor(w.length / 2);
  const width = n * unit + 2 * margin;
  const height = n * unit + 2 * margin;
  const pathid = "d" + w.join("");

  const container = $(`
  <div id="${pathid}" class="dyck-container degree-${area+dinv} area-${area} dinv-${dinv}">
    <canvas class="dyck-canvas" width="${width}" height="${height}"></canvas>
    <div class="dyck-overlay" style="width: ${width}px; height: ${height}px">
      <pre class="dyck-info">area = ${area}\ndinv = ${dinv}</pre>
    </div>
  </div>`);
  const canvas = container.find("canvas").get(0);
  draw_grid(canvas, unit, margin);
  draw_path(canvas, w, unit, margin);
  container.get(0).data = path;
  return container;
}

export { draw_grid, draw_path, make_path };
