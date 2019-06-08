import React, { Component } from 'react';
import axios from 'axios'
import FileUpload from '../common/FileUpload'

class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      file: '',
      spinner: false,
      error: null
    }
    // this.loadFiles = this.loadFiles.bind(this);
  }
  componentDidMount() {
    // this.loadFiles();
  }
  loadFiles() {
    axios.get('/api/upload/files')
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
  }
  uploadFile(event) {
    event.preventDefault();
    let data = new FormData()
    console.log({files:this.state.files})
    console.log(Array.from(this.state.files))
    if(Array.from(this.state.files).length===0)
    {
      this.setState({error: 'Please choose at least one file to upload'})
      return
    }
    this.setState({spinner: true})

    Array.from(this.state.files).forEach((file, i) => {
      data.append("file", file, file.name);
    });

    axios.post('/api/upload/upload',data)
      .then(res => {
        this.setState({spinner: false})
        if (res.data.success) {
          window.location.href='/uploadSuccess'
          // this.loadFiles();
        } else {
          alert('Upload failed');
        }
      })
  }
  render() {
    const { files } = this.state;
    let spin = (
      <div>
        <FileUpload/>
        <p style={{ color: 'white', background: 'green' }} className='btn w-100'>
          You will be notified once upload is completed</p>
      </div>
    )
    let info;
    if(this.state.error!==null) {
      info = (
        <div>
          <p style={{ color: 'red', fontStyle: 'italic'}} className='w-100'>
            {this.state.error}</p>
        </div>
      )
    } else {
      info = (
        <p style={{ color: 'white',background: 'rgba(187,65,147,0.5)',fontStyle: 'italic'}} className='w-100'>
          You can choose multiple files at same time</p>
      )
    }
    return (
      <div className="uploadMultipleFiles">
        <div className="App-content row d-flex justify-content-center" >
          <div className="grid text-center col-md-12">
            <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
              fontFamily: 'Lobster',
              color: 'black', fontSize: '48px'
            }}> Welcome L V Prasad MRI Docs Cloud</h1>
          </div>
          <div className="col-md-6 text-center" style={{width: '100%'}}>
            <p style={{ color: 'white', background: 'green' }} className='btn w-100'>
              Enter the Details below to upload the images</p>
            {info}
            <div className='row d-flex justify-content-center'>
              <input type="file" onChange={this.fileChanged.bind(this)} required multiple name='files'
                     style={{border: '1.5px', borderStyle: 'solid',
                       borderRadius:'5px', margin: '5px',minWidth:'100%'}}/>
              <button className='btn btn-success ' style={{background: 'green'}}
                      onClick={this.uploadFile.bind(this)}>Upload</button>
            </div>
            {this.state.spinner ? spin : null}
          </div>
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