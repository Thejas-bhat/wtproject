import React from 'react';
import './Custom.css'
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import logo from './logo.svg';
import code from './code.jpg'
import DrawArea from './Test';



class App extends React.Component {
    componentDidMount() {
    //   const canvas = this.refs.canvas
    //   const ctx = canvas.getContext("2d")
    //   const img = this.refs.image
    //   img.onload = () => {
    //     ctx.drawImage(img, 0, 0)
        
    //   }
      ReactDOM.render(<DrawArea />, document.getElementById("container"));
    }
    render() {
      return(
        <div id="container">
        </div>
      )
    }
  }
  export default App
