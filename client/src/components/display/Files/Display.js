import React, { Component } from 'react';
import Spinner from '../../common/Spinner'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { downloadSelectedFiles, getFilesByFolder } from '../../../actions/homeActions'
import FileRow from './FileRow'
import { Link } from 'react-router-dom'
import getLocalDate from '../../../utils/getLocalDate'
import FileItem from './FileItem'
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';


class Display extends Component {
  constructor () {
    super()
    this.state = {
      show: false,
      selected: [],
      patientId: null,
      downloading: false
    }
    this.onBack = this.onBack.bind(this)
    this.openSidebar = this.openSidebar.bind(this)
    this.onSelectedDownload = this.onSelectedDownload.bind(this)
    this.closeSidebar = this.closeSidebar.bind(this)
  }
  componentDidMount () {
    if (this.props.auth.user.role === 'lvpei') {
      this.props.getFilesByFolder(this.props.match.params.id)
    }
  }
  onBack (e) {
    // window.location.reload()
  }
  openSidebar (e) {
    this.setState({show:true, patientId:this.props.folder.files.patient._id})
  }
  onSelectedDownload (e) {
    // console.log(this.state.selected)
    this.props.downloadSelectedFiles({selected:this.state.selected, id:this.state.patientId})
    this.setState({downloading: true})

  }
  // loadFiles() {
  //   fetch('/api/files')
  //     .then(res => res.json())
  //     .then(files => {
  //       if (files.message) {
  //         console.log('No Files');
  //         this.setState({ files: [] })
  //       } else {
  //         this.setState({ files })
  //       }
  //     });
  // }
  //
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
  selectionChanges = (newValues) => {
    this.setState({
      selected: newValues
    });
  }
  closeSidebar (e) {
    this.setState({show:false})
  }
  render() {
    const {files, loading, notFound} = this.props.folder
    let  content, sidebar=null,displayBar=null;
    let showButton;
    if(!this.state.show) {
      showButton=(<div style={{marginRight:'10px', marginTop:'20px'}}>
        <button className='btn btn-sm' style={{background:'green', color:'white'}}
                onClick={this.openSidebar}>Select files for download</button>
      </div>)
    }else {
      showButton=null
    }
    let sdDownload=null
    if(!this.state.downloading) {
      sdDownload=(<button className='btn btn-sm' onClick={this.onSelectedDownload}
                          style={{background:'green', color:'white'}}>
        Download</button>)
    } else {
      sdDownload=(<p>Download has started....</p>)
    }
    if (loading || files===null) {
      content=<Spinner/>

    } else {
      if(this.state.show) {
        // displayBar = (
        //
        // )
        sidebar = (
          <div className='wrapper d-flex justify-content-end' style={{marginRight:'20%',right: '5%'}}>
            <div className='col-md-6'
                 style={{ borderStyle:'solid', borderRadius:'5px',minWidth:'250px', maxWidth:'350px', right:'0',left:'60%'}}>
              <h5>Selected Files</h5>
              <ul  className="card card-body text-center">
              {this.state.selected.map(file => (
                  <li key={file} style={{overflow: 'hidden'
                    ,OTextOverflow: 'ellipsis', textOverflow:'ellipsis', whiteSpace: 'nowrap' }}
                  >{file.substr(file.lastIndexOf(';') + 1, file.length)}
                  </li>
              ))}
              </ul>
            </div>
            <div className='col-md-6'
                 style={{ borderStyle:'solid', borderRadius:'5px', right:'0',left:'60%', minWidth:'250px',  maxWidth:'350px'}}>
              <div className='row d-flex justify-content-between'>
                {sdDownload}

                <button onClick={this.closeSidebar} style={{color:'red',background:'white', borderStyle:'none'}}>
                  <i className="fas fa-window-close"/>
                </button>
              </div>
              <CheckboxGroup name="selected" checkboxDepth={3} value={this.state.selected} onChange={this.selectionChanges}>
                <ul className="card card-body text-center">
                {files.files.map(file => (
                    <li  key={file.filename} style={{overflow: 'hidden'
                      ,OTextOverflow: 'ellipsis', textOverflow:'ellipsis', whiteSpace: 'nowrap' }}
                    >{file.filename.substr(file.filename.lastIndexOf(';') + 1, file.filename.length)}
                      <Checkbox value={file.filename}/></li>
                ))}
                </ul>

              </CheckboxGroup>
            </div>
          </div>
        )
      }
      if(notFound) {
        content=(<div className="App-content row d-flex justify-content-center" >
          <div className="grid text-center col-md-12">
            <div className='row '>
              <div style={{margin: '10px'}}>
                <Link to={`/displayFolder/${files.patient.mrNo}`} className='btn' style={{background: 'white', color: 'green'}}>
                  <i className="fa fa-chevron-circle-left fa-3x" aria-hidden="true"/></Link>
              </div>
              {/*<h1 className="grid--cell fl1 fs-headline1 text-center" style={{*/}
              {/*  color: 'black'*/}
              {/*}}> Welcome to L V Prasad Cloud</h1>*/}
            </div>
          </div>
          <div>
            <p>Nothing is uploaded yet, please check back later</p>
          </div>
        </div>)
      }else {
        content=(
            <div className="App-content row d-flex justify-content-center" >
              <div className="grid text-center col-md-12">
                <div className='row d-flex justify-content-between'>
                  <div style={{margin: '10px'}}>
                    <Link to={`/displayFolder/${files.patient.mrNo}`} onClick={this.onBack} className='btn' style={{background: 'white', color: 'green'}}>
                      <i className="fa fa-chevron-circle-left fa-3x" aria-hidden="true"/></Link>
                  </div>
                  {/*<h1 className="grid--cell fl1 fs-headline1 text-center" style={{*/}
                  {/*  color: 'black'*/}
                  {/*}}> Welcome to L V Prasad Cloud</h1>*/}
                  {showButton}
                </div>
                <h5>All files uploaded at {' '}{getLocalDate(files.patient.lastUploadAt)} {' '} of patient{' '}
                  {files.patient.mrNo}</h5>

              </div>
              <FileRow files={files.files} patient={files.patient} check={true}/>
            </div>
        )
      }
    }
    return (
      <div className="displayFiles wrapper d-flex justify-content-between col-md-12">
        <div>
          {content}
        </div>
        <div>
          {sidebar}
        </div>
      </div>
    );
  }
}

Display.propTypes = {
  home: PropTypes.object.isRequired,
  getFilesByFolder: PropTypes.func.isRequired,
  downloadSelectedFiles: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
  folder: state.folder
})
// {/*<table>*/}
// {/*  <thead>*/}
// {/*  <tr>*/}
// {/*    <th>File</th>*/}
// {/*    <th>Uploaded</th>*/}
// {/*    <th>Size</th>*/}
// {/*    <th/>*/}
// {/*  </tr>*/}
// {/*  </thead>*/}
// {/*  <tbody>*/}
//
// {/*  </tbody>*/}
// {/*</table>*/}

// {/*{files.map((file, index) => {*/}
// {/*  let d = new Date(file.uploadDate)*/}
// {/*  return (*/}
// {/*    <tr key={index}>*/}
// {/*      <td><a href={`http://localhost:3001/api/files/${file.filename}`}>{file.filename}</a></td>*/}
// {/*      <td>{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</td>*/}
// {/*      <td>{(Math.round(file.length/100) / 10)+'KB'}</td>*/}
// {/*      <td><button onClick={this.deleteFile.bind(this)} id={file._id}>Remove</button></td>*/}
// {/*    </tr>*/}
// {/*  )*/}
// {/*})}*/}
export default connect(mapStateToProps, { getFilesByFolder, downloadSelectedFiles })(Display);