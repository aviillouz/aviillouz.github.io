import React from 'react';
import file_upload from './files-and-folders-white.svg';
import './App.css';
import Dropzone from 'react-dropzone'
import parquet from 'parquetjs';
import { useTable } from 'react-table'
import styled from 'styled-components'
const fs = require('browserify-fs');


const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
    td {
      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }
  .pagination {
    padding: 0.5rem;
  }
`

async function read(parquetFile) {

  // const selectedFile = document.getElementById('input').files[0];
  let buf = await parquetFile.arrayBuffer();

  fs.mkdir('/home');
  fs.writeFile('/home/_temp.parquet', buf);

  let reader = await parquet.ParquetReader.openFile('/home/_temp.parquet');
  let cursor = reader.getCursor();
  let record = null;
  let records = [];
  while (record = await cursor.next()) {
    records.push(record);
  }

  reader.close();
  return records;
}

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { data: [], columns: [] };
    this.onDrop = this.onDrop.bind(this);
  }

  async onDrop(droppedFiles) {
    console.log('reading file ' + droppedFiles[0].path);
    let records = await read(droppedFiles[0]);
    let keys = Object.keys(records[0]).map(k => ({ 'Header': k, 'accessor': k }));

    keys = JSON.parse(JSON.stringify(keys));
    records = JSON.parse(JSON.stringify(records));

    console.log(keys);
    console.log(records);

    this.setState(({ columns: keys, data: records }));
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Dropzone onDrop={this.onDrop}>
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
        <Styles>
          <Table columns={this.state.columns} data={this.state.data} />

        </Styles>

      </div>
    );
  }
}

export default App;
