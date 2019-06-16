import React, { Component } from 'react';
import Spinner from '../../common/Spinner'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {  getFilesByFolder } from '../../../actions/homeActions'
import FileRow from './FileRow'
import { Link } from 'react-router-dom'


class Display extends Component {

  componentDidMount () {
    if (this.props.auth.user.role === 'lvpei') {
      this.props.getFilesByFolder(this.props.match.params.id)
    }
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

  render() {
    const {files, loading, notFound} = this.props.folder
    let allFoldersContent, heading;
    if (loading || files===null) {
      allFoldersContent = <Spinner/>
      heading=null
    } else {
      if(notFound) {
        allFoldersContent = (
          <div>
            <p>Nothing is uploaded yet, please check back later</p>
          </div>
        )
      }else {
        console.log({files: files})
        allFoldersContent = (
          <FileRow files={files.files}/>
        )
        heading=(<h3>All files uploaded at {' '}{files.patient.lastUploadAt} {' '} of {' '}
        {files.patient.mrNo}</h3>
        )
      }
    }
    return (
      <div className="displayFiles">
        <div className="App-content row d-flex justify-content-center" >
          <div className="grid text-center col-md-12">
            <div className='row '>
              <div style={{margin: '10px'}}>
                <Link to='/dashboard' className='btn' style={{background: 'white', color: 'green'}}>
                  <i className="fa fa-chevron-circle-left fa-3x" aria-hidden="true"/></Link>
              </div>
              <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                fontFamily: 'Lobster',
                color: 'black', fontSize: '48px'
              }}> Welcome to L V Prasad Cloud</h1>
              {heading}
            </div>
          </div>
          {allFoldersContent}
        </div>
      </div>
    );
  }
}

Display.propTypes = {
  home: PropTypes.object.isRequired,
  getFilesByFolder: PropTypes.func.isRequired,
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
export default connect(mapStateToProps, { getFilesByFolder })(Display);