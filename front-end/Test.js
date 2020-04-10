import React, { Component } from "react";
import Konva from "konva";
import { render } from "react-dom";
import { Stage, Layer, Image, Line, Text } from "react-konva";
import UseImage from 'use-image';
import './Custom.css';

const LionImage = () => {
    const [image] = UseImage('https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg');
    
    return <Image className = "image" image={image} />;
  };

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
        className = "drawArea"
        width={window.innerWidth}
        height={window.innerHeight}
        onContentMousedown={this.handleMouseDown}
        onContentMousemove={this.handleMouseMove}
        onContentMouseup={this.handleMouseUp}
        ref={node => {
          this.stageRef = node;
        }}
      >
        <Layer >
        <LionImage />
          {this.state.lines.map((line, i) => (
            <Line  key={i} points={line} stroke="black" />
          ))}
        </Layer>
      </Stage>
    );
  }
}

export default Test