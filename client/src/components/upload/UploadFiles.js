import React, { Component } from 'react';
import axios from 'axios'
import FileUpload from '../common/FileUpload'
import classnames from 'classnames'
import Select from 'react-select'
import TextAreaFieldGroup from '../common/TextAreaGroupField'
import ProgressBar from 'react-bootstrap/ProgressBar'

class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      file: '',
      spinner: false,
      category: null,
      remarks: '',
      error: null,
      progress:  0
    }
    // this.loadFiles = this.loadFiles.bind(this);
    this.onSelectType = this.onSelectType.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
  }
  // componentDidMount() {
  //   // this.loadFiles();
  // }
  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSelectType (e) {
    this.setState({category: e})
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
  myUploadProgress = () => (progress) => {
    let percentage = Math.floor((progress.loaded * 100) / progress.total)
    this.setState({progress:percentage})
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
    if(this.state.category===null) {
      this.setState({error: 'Please select the type of upload'})
      return
    }
    this.setState({spinner: true})
    data.append('category', this.state.category.value)
    data.append('remarks', this.state.remarks)
    Array.from(this.state.files).forEach((file, i) => {
      data.append("file", file, file.name);
    });

    axios.post('/api/upload/upload',data,{onUploadProgress: this.myUploadProgress()})
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
    let scanTypeArray= [{ value: 'CT', label: 'CT' },{value:'MRI', label: 'MRI'},
      {value:'CT Angiography', label: 'CT Angiography'},
      {value: 'MRI Angiography', label: 'MRI Angiography'}, {value: 'PET Scan', label: 'PET Scan'},
      {value: 'USG Abdomen', label: 'USG Abdomen'}, {value:'Blood Tests', label: 'Blood Tests'}]
    let spin = (
      <div>
        {/*<FileUpload/>*/}
        <ProgressBar striped variant="info" now={this.state.progress} label={`${this.state.progress}%`}/>
        <p style={{ color: 'white', background: 'green' }} className='btn w-100'>
          You will be notified once upload is completed</p>
      </div>
    )
    let downloadBut = (
      <button className='btn btn-success ' style={{background: 'green'}}
              onClick={this.uploadFile.bind(this)}>Upload</button>
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
        <p style={{ color: 'green',fontStyle: 'italic'}} className='w-100'>
          You can choose multiple files at same time</p>
      )
    }
    return (
      <div className="uploadMultipleFiles" style={{maxWidth: '330px', margin:'5px'}}>
        <div className="App-content row d-flex justify-content-center" >
          <div className="grid text-center col-md-12">
            <h3 className="grid--cell fl1 fs-headline1 text-center" style={{
              color: 'black'
            }}>Select the files to upload</h3>
            {info}
          </div>
          <div className="col-md-12 text-center" style={{width: '100%', margin:'5px'}}>
            {/*<p style={{ color: 'white', background: 'green' }} className='btn w-100'>*/}
            {/*  Enter the Details below to upload the images</p>*/}
            <Select options={scanTypeArray} className={classnames('isSearchable')}
                    placeholder="Choose type" style={{minWidth:'250px'}}
                    name="category" value={this.state.category} onChange={this.onSelectType}>
            </Select>
              <div className='row col-md-12 d-flex justify-content-center'>
                <input type="file" onChange={this.fileChanged.bind(this)} required multiple name='files'
                       style={{border: '1.5px', borderStyle: 'solid',
                         borderRadius:'5px', margin: '5px',minWidth:'100%'}}/>
              </div>
            <TextAreaFieldGroup placeholder="Enter Remarks here(Optional)" style={{ margin:'5px'}}
                            type="text" onChange={this.changeHandler} value={this.state.remarks} name="remarks"
            />

            {!this.state.spinner ? downloadBut : null}
            {this.state.spinner ? spin : null}
          </div>

        </div>
      </div>
    );
  }
}
export default UploadFiles;