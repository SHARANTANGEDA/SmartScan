import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import '../allFolders.css'
import { downloadFile } from '../../../actions/homeActions'
import { Link } from 'react-router-dom'

class FileItem extends Component {
  constructor () {
    super();
    this.onOpen = this.onOpen.bind(this);
  }
  onOpen(e) {
    console.log('in open')
    console.log(this.props.file.filename )
    this.props.downloadFile(this.props.file.filename )
  }
  render () {
    const {file} = this.props;
    return (
      //onTouchStart="this.classList.toggle('hover');
      <div className="">
        <div className="image-flip" >
          <div className="mainflip">
            <div className="frontside">
                {/*<Link to={`/api/upload/downloadFile/${file.filename}`}>*/}
                  <span>
                  <button onClick={this.onOpen.bind(this)}>
                    <div className="card" style={{minWidth: '200', borderStyle: 'none'}}>
                      <div className="card-body text-center">
                        <p><img className="img-fluid" src={require('../../../img/file.png')} alt=''/></p>
                        <div className='row d-flex justify-content-between'>
                          <h4 className="card-title" style={{fontSize: '18px'}}>{file.filename}</h4>
                        </div>
                      </div>
                    </div>
                  </button>
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
export default connect(mapStateToProps, {downloadFile})(FileItem);