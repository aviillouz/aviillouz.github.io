import React from 'react';
import logo from './logo.svg';
import file_upload from './files-and-folders-white.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={file_upload} className="App-logo" alt="logo" />
        <p>
          Drag a file here to View
        </p>
      </header>
    </div>
  );
}

export default App;
