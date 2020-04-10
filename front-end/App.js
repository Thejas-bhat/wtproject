import React from 'react';
import './Custom.css'
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
// import logo from './logo.svg';
// import code from './code.jpg'
import DrawArea from './Test';
import PreviewComponent from './upload';



class App extends React.Component {
    componentDidMount() {
    //   const canvas = this.refs.canvas
    //   const ctx = canvas.getContext("2d")
    //   const img = this.refs.image
    //   img.onload = () => {
    //     ctx.drawImage(img, 0, 0)

    //   }
      ReactDOM.render(<DrawArea />, document.getElementById("container"));
      ReactDOM.render(<PreviewComponent/>, document.getElementById("mainApp"));
    }
    render() {
      return(
        <div>
        <div id="mainApp">

        </div>
        <div id="container">
        </div>
        </div>
      )
    }
  }
  export default App
