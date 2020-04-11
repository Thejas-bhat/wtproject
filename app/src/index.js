import React from 'react';
import ReactDOM from 'react-dom';
import './App.css'
import DrawArea from './Test';
import PreviewComponent from './App';

ReactDOM.render(<DrawArea />, document.getElementById("container"));
ReactDOM.render(<PreviewComponent/>, document.getElementById("mainApp"));
