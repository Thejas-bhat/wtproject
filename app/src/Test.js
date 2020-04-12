import React, { Component } from "react";
import { Stage, Layer, Line} from "react-konva";
import './App.css';


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

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  handleMouseUp = () => {
    this._drawing = false;
    var b64 = document.getElementById("oldboi").toDataURL("image/png");
    var file = this.dataURLtoFile(b64, 'mask.png');

    const data = new FormData();
    data.append('file', file);
    data.append('filename', "mask.png");

    fetch('http://0.0.0.0:5000/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ imageURL: `http://localhost:5000/${body.file}` });
      });
    });
  };

  render() {
    return (
      <Stage
        width={1920}
        height={1080}
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
