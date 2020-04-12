import React, { Component } from "react";
import { Stage, Layer, Line} from "react-konva";
import './App.css';


class Test extends Component {
  state = {
    lines: []
  };

  resizeCanvasImage(img, canvas, maxWidth, maxHeight) {
      var imgWidth = img.width,
          imgHeight = img.height;

      var ratio = 1, ratio1 = 1, ratio2 = 1;
      ratio1 = maxWidth / imgWidth;
      ratio2 = maxHeight / imgHeight;

      // Use the smallest ratio that the image best fit into the maxWidth x maxHeight box.
      if (ratio1 < ratio2) {
          ratio = ratio1;
      }
      else {
          ratio = ratio2;
      }

      var canvasContext = canvas.getContext("2d");
      var canvasCopy = document.createElement("canvas");
      var copyContext = canvasCopy.getContext("2d");
      var canvasCopy2 = document.createElement("canvas");
      var copyContext2 = canvasCopy2.getContext("2d");
      canvasCopy.width = imgWidth;
      canvasCopy.height = imgHeight;
      copyContext.drawImage(img, 0, 0);

      // init
      canvasCopy2.width = imgWidth;
      canvasCopy2.height = imgHeight;
      copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);


      var rounds = 2;
      var roundRatio = ratio * rounds;
      for (var i = 1; i <= rounds; i++) {
          console.log("Step: "+i);

          // tmp
          canvasCopy.width = imgWidth * roundRatio / i;
          canvasCopy.height = imgHeight * roundRatio / i;

          copyContext.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvasCopy.width, canvasCopy.height);

          // copy back
          canvasCopy2.width = imgWidth * roundRatio / i;
          canvasCopy2.height = imgHeight * roundRatio / i;
          copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);

      } // end for


      // copy back to canvas
      canvas.width = imgWidth * roundRatio / rounds;
      canvas.height = imgHeight * roundRatio / rounds;
      canvasContext.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvas.width, canvas.height);


  }

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
    var stage = this.stageRef.getStage();
    stage.clear();
    var canvasPapa = document.getElementById("container").firstChild.firstChild;
    var oldCanvas = document.getElementById("oldboi");
    
    this.setState({
      lines: []
    });

    this._drawing = false;
    var b64 = oldCanvas.toDataURL("image/png");
    var file = this.dataURLtoFile(b64, 'mask.png');

    const data = new FormData();
    data.append('file', file);
    data.append('filename', "mask.png");

    fetch('http://0.0.0.0:5000/upload', {
          method: 'POST',
          body: data,
        }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then((myBlob) => {
      var canvas = document.getElementById("myCanv");
      var myImage = document.createElement("img");
      myImage.src = URL.createObjectURL(myBlob);
      var oldthis = this;
      myImage.onload = function() {
        
        oldthis.resizeCanvasImage(myImage, canvas, myImage.width, myImage.height);
      }
      console.log(myBlob);
      console.log("result from server", myImage, canvas);
      
      canvasPapa.removeChild(canvasPapa.childNodes[0]);
      canvasPapa.appendChild(canvas);
      canvasPapa.appendChild(oldCanvas);

    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
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
