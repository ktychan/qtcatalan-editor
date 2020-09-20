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
function make_path(path, onclick, unit = 40, margin = 5) {
  let w = path[0];
  let area = path[1];
  let dinv = path[2];
  let bounce = path[3];

  let n = Math.floor(w.length / 2);
  let width = n * unit + 2 * margin;
  let height = n * unit + 2 * margin;

  let canvas = document.createElement("canvas");
  canvas.className = "dyck-canvas";
  canvas.width = width;
  canvas.height = height;
  draw_grid(canvas, unit, margin);
  draw_path(canvas, w, unit, margin);

  let info = document.createElement("pre");
  info.className = "dyck-info";
  info.innerHTML += `  area = ${area}\n`;
  info.innerHTML += `  dinv = ${dinv}\n`;
  info.innerHTML += `bounce = ${bounce}`;

  let overlay = document.createElement("div");
  overlay.className = "dyck-overlay";
  overlay.style = `width: ${width}px; height: ${height}px`;
  overlay.appendChild(info);

  let a = document.createElement("a");
  a.name = w.join("");

  let container = document.createElement("div");
  container.data = path;
  container.id = w.join("");
  container.className = "dyck-container";
  container.appendChild(canvas);
  container.appendChild(overlay);
  container.onclick = () => onclick(container);

  return container;
}

export { draw_grid, draw_path, make_path };
