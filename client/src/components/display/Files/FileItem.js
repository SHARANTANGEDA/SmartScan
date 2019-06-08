import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import '../allFolders.css'
import { downloadFile,deleteFile } from '../../../actions/homeActions'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { NO_FILES } from '../../../actions/types'

class FileItem extends Component {
  constructor () {
    super();
    this.onOpen = this.onOpen.bind(this);
    this.onDelete = this.onDelete.bind(this)
  }
  onOpen(e) {
    this.props.downloadFile(this.props.file.filename )
  }
  onDelete(e) {
    console.log('hello')
    // axios.delete(`/api/upload/deleteFile/${this.props.file.filename}`).then(res => {
    //   console.log(res)
    //   window.location.reload()
    // })
    this.props.deleteFile(this.props.file.filename)
  }
  render () {
    const {file} = this.props;
    let name = file.filename.substr( file.filename.indexOf('_')+1, file.filename.length)
    return (
      //onTouchStart="this.classList.toggle('hover');
      <div className="">
        <div className="image-flip" >
          <div className="mainflip">
            <div className="frontside">
                {/*<Link to={`/api/upload/downloadFile/${file.filename}`}>*/}
                  <span>
                    <div className="card" style={{minWidth: '200', borderStyle: 'solid'}}>
                      <div className="card-body text-center">
                        <p><img className="img-fluid" src={require('../../../img/file.png')} alt=''/></p>
                        <div className='row d-flex justify-content-center'>
                          <h4 className="card-title" style={{fontSize: '18px'}}>{name}</h4>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-around">
                  <button className='btn-sm btn' style={{background: 'green', color: 'white',marginRight: '10px'}}
                          onClick={this.onOpen.bind(this)}><i className="fa fa-download" aria-hidden="true"/></button>
                  <button className='btn-sm btn' onClick={this.onDelete.bind(this)}
                          style={{background: 'red', color: 'white',marginLeft: '10px'}}
                  ><i className="fa fa-trash" aria-hidden="true"/></button>
                </div>
                    </div>
                  </span>
                {/*</Link>*/}
        </div>
          </div>
        </div>
      </div>
    )
  }
}

FileItem.propTypes = {
  file: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  downloadFile: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, {downloadFile, deleteFile})(FileItem);