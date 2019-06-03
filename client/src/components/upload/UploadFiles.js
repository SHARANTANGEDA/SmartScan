import React, { Component } from 'react';
import axios from 'axios'
class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      file: ''
    }
    // this.loadFiles = this.loadFiles.bind(this);
  }
  componentDidMount() {
    // this.loadFiles();
  }
  loadFiles() {
    fetch('/api/files')
      .then(res => res.json())
      .then(files => {
        if (files.message) {
          console.log('No Files');
          this.setState({ files: [] })
        } else {
          this.setState({ files })
        }
      });
  }
  fileChanged(event) {
    this.setState({ [event.target.name]: event.target.files });
    //
    // const f = event.target.files[0];
    // this.setState({
    //   file: f
    // });
  }
  // deleteFile(event) {
  //   event.preventDefault();
  //   const id = event.target.id;
  //   fetch('/api/files/'+id, {
  //     method: 'DELETE'
  //   }).then(res => res.json())
  //     .then(response => {
  //       console.log(response);
  //       if (response.success) this.loadFiles()
  //       else alert('Delete Failed');
  //     })
  // }
  uploadFile(event) {
    event.preventDefault();
    let data = new FormData();
    let d =new Date();

    console.log({files:this.state.files})
    let myFiles = this.state.files
    let len = myFiles.length
    console.log(Array.from(myFiles))
    // Array.from(myFiles).forEach(file => {
    //   console.log({file:file})
    //   data.append('files[]', file,file.name)
    // });
    Array.from(myFiles).forEach((file, i) => {
      data.append("file", file, file.name);
    });

    console.log({data: data})
    axios.post('/api/upload/upload',data)
      .then(res => {
        console.log(res)
        if (res.data.success) {
          console.log('Success!!!')
          // this.loadFiles();
        } else {
          alert('Upload failed');
        }
      })
    // fetch('/api/upload/upload', {
    //   method: 'POST',
    //   body: Array.from(myFiles)
    // }).then(res => res.json('hello'))

  }
  render() {
    const { files } = this.state;
    return (
      <div className="uploadMultipleFiles">
        <div className="App-content">
          <input type="file" onChange={this.fileChanged.bind(this)} required multiple name='files'/>
          <button onClick={this.uploadFile.bind(this)}>Upload</button>
          {/*<table className="App-table">*/}
          {/*  <thead>*/}
          {/*  <tr>*/}
          {/*    <th>File</th>*/}
          {/*    <th>Uploaded</th>*/}
          {/*    <th>Size</th>*/}
          {/*    <th/>*/}
          {/*  </tr>*/}
          {/*  </thead>*/}
          {/*  <tbody>*/}
          {/*  {files.map((file, index) => {*/}
          {/*    let d = new Date(file.uploadDate)*/}
          {/*    return (*/}
          {/*      <tr key={index}>*/}
          {/*        <td><a href={`http://localhost:3001/api/files/${file.filename}`}>{file.filename}</a></td>*/}
          {/*        <td>{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</td>*/}
          {/*        <td>{(Math.round(file.length/100) / 10)+'KB'}</td>*/}
          {/*        <td><button onClick={this.deleteFile.bind(this)} id={file._id}>Remove</button></td>*/}
          {/*      </tr>*/}
          {/*    )*/}
          {/*  })}*/}
          {/*  </tbody>*/}
          {/*</table>*/}
        </div>
      </div>
    );
  }
}
export default UploadFiles;