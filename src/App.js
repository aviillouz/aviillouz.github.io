import React from 'react';
import file_upload from './files-and-folders-white.svg';
import './App.css';
import Dropzone from 'react-dropzone'
import parquet from 'parquetjs';
const fs = require('browserify-fs');

async function read(parquetFile) {

  // const selectedFile = document.getElementById('input').files[0];
  let buf = await parquetFile.arrayBuffer();

  fs.mkdir('/home');
  fs.writeFile('/home/_temp.parquet', buf);

  let reader = await parquet.ParquetReader.openFile('/home/_temp.parquet');
  let cursor = reader.getCursor();
  let record = null;
  while (record = await cursor.next()) {
    console.log(record);
  }

  reader.close();
}

async function onDrop(droppedFiles) {
  console.log(droppedFiles[0].path);
  read(droppedFiles[0]);
}

// async function read() {
//   let reader = await ParquetReader.openFile('fruits.parquet');

//   let cursor = reader.getCursor();
//   let record = null;
//   while (record = await cursor.next()) {
//     console.log(record);
//   }
// }


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <img src={file_upload} className="App-logo" alt="logo" />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </header>


    </div>
  );
}

export default App;
