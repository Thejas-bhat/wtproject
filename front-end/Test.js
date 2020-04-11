import React, { Component } from "react";
import Konva from "konva";
import { render } from "react-dom";
import { Stage, Layer, Image, Line, Text } from "react-konva";
import UseImage from 'use-image';
import './Custom.css';


class Test extends Component {
  state = {
    lines: []
  };

  handleMouseDown = () => {
    this._drawing = true;
    // add line
    this.setState({
      lines: [...this.state.lines, []]
    });
  };

  handleMouseMove = e => {
    // no drawing - skipping
    if (!this._drawing) {
      return;
    }
    const stage = this.stageRef.getStage();
    const point = stage.getPointerPosition();
    const { lines } = this.state;

    let lastLine = lines[lines.length - 1];
    // add point
    lastLine = lastLine.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    this.setState({
      lines: lines.concat()
    });
  };

  handleMouseUp = () => {
    this._drawing = false;
  };

  render() {
    return (
      <Stage
        width={400}
        height={400}
        onContentMousedown={this.handleMouseDown}
        onContentMousemove={this.handleMouseMove}
        onContentMouseup={this.handleMouseUp}
        ref={node => {
          this.stageRef = node;
        }}
      >
        <Layer >

          {this.state.lines.map((line, i) => (
            <Line key={i} points={line} strokeWidth = "20" stroke="black" />
          ))}
        </Layer>
      </Stage>
    );
  }
}

export default Test