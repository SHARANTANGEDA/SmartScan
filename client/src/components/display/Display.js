import React, { Component } from 'react';
import Spinner from '../common/Spinner'
import FolderRow from './FolderRow'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


class Display extends Component {

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

  deleteFile(event) {
    event.preventDefault();
    const id = event.target.id;
    fetch('/api/files/'+id, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(response => {
        console.log(response);
        if (response.success) this.loadFiles()
        else alert('Delete Failed');
      })
  }

  render() {
    const { files } = this.state;
    let allFoldersContent;
    if (profiles === null || loading ) {
      allFoldersContent = <Spinner/>
    } else {
      allFoldersContent = (
        <FolderRow folders={profiles}/>
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
          {allFoldersContent}
        </div>
      </div>
    );
  }
}

Display.propTypes = {
  home: PropTypes.object.isRequired,
  getDetails: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
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
export default connect(mapStateToProps, {   })(Display);