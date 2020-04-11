import React, { Component } from "react";
import './App.css';


class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: ''};
  }
  renderTheImage(){
    var uploadedImage = document.getElementsByClassName("imgPreview")[0].firstChild;
    var canvasPapa = document.getElementById("container").firstChild.firstChild;
    var oldCanvas = canvasPapa.firstChild;
    
    var newCanvas = document.createElement("canvas");
    newCanvas.id = "myCanv";
    const computedStyle = window.getComputedStyle(oldCanvas);
    Array.from(computedStyle).forEach(key => newCanvas.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)));

    // console.log(newCanvas.style == oldCanvas.style);
    var ctx = newCanvas.getContext("2d");
    ctx.drawImage(uploadedImage, 0, 0, uploadedImage.width, uploadedImage.height,
                                  0, 0, newCanvas.width, newCanvas.height);
    console.log(uploadedImage.width);
    canvasPapa.removeChild(canvasPapa.childNodes[0]);
    canvasPapa.appendChild(newCanvas);
    canvasPapa.appendChild(oldCanvas);
  }
  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
    this.renderTheImage();
    // console.log("hi", a);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <div className="previewComponent">
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <input className="fileInput"
            type="file"
            onChange={(e)=>this._handleImageChange(e)} />
          <button className="submitButton"
            type="submit"
            onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
        </form>
        <div className="imgPreview">
          {$imagePreview}
        </div>
      </div>
    )
  }
}

export default Upload