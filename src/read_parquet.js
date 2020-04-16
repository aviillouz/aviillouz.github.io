'use strict';
const parquet = require('parquetjs');
const fs = require('browserify-fs');


async function read() {

    const selectedFile = document.getElementById('input').files[0];
    let buf = await selectedFile.arrayBuffer(selectedFile);

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