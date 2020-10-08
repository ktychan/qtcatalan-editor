import React from "react";
import './dyck.scss';

export default class DyckPath extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.clear_canvas();
    this.draw_grid();
    this.draw_path();
  }

  componentDidUpdate() {
    this.clear_canvas();
    this.draw_grid();
    this.draw_path();
  }

  render() {
    const {word,area,dinv,selected} = this.props.data;

    const n = Math.floor(word.length / 2);
    const width = n * this.props.unit + 2 * this.props.margin;
    const height = n * this.props.unit + 2 * this.props.margin;
    const pathid = "d" + word.join("");
    const selected_class = selected ? "selected" : "";
    return (
      <div id={pathid} className={`dyck-container ${selected_class}`}>
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

  clear_canvas() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
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
    const {word} = this.props.data;
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
    for (let s of word) {
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
