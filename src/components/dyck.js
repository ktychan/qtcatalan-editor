import React from "react";
import './dyck.scss';

export default class DyckPath extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.draw_grid();
    this.draw_path();
  }

  render() {
    const w = this.props.data[0];
    const area = this.props.data[1];
    const dinv = this.props.data[2];

    const n = Math.floor(w.length / 2);
    const width = n * this.props.unit + 2 * this.props.margin;
    const height = n * this.props.unit + 2 * this.props.margin;
    const pathid = "d" + w.join("");

    return (
      <div id={pathid} className="dyck-container">
        <canvas
          ref={this.canvasRef}
          width={width}
          height={height}
        ></canvas>
        <div
          className="dyck-overlay"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <pre className="dyck-info">{`area = ${area}\ndinv = ${dinv}`}</pre>
        </div>
      </div>
    );
  }

  draw_grid() {
    const canvas = this.canvasRef.current;
    const unit = this.props.unit;
    const margin = this.props.margin;

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

  draw_path() {
    const canvas = this.canvasRef.current;
    const w = this.props.data[0];
    const unit = this.props.unit;
    const margin = this.props.margin;

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
}
