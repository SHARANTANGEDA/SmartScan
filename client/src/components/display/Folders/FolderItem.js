import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import '../allFolders.css'
import { deleteFolder, downloadFolder } from '../../../actions/homeActions'
import downloading from '../../common/downloading.gif'



class FolderItem extends Component {
  constructor () {
    super();
    this.state = {
      file: false
    };
    this.onOpen = this.onOpen.bind(this);
    this.onDownload = this.onDownload.bind(this)
  }

  onOpen(e) {
    this.setState({file: true})
  }
  onDownload(e) {
    e.preventDefault()
    this.setState({file: true})
    this.props.downloadFolder(this.props.folder._id )
  }
  onDelete(e) {
    e.preventDefault()
    this.props.deleteFolder(this.props.folder._id )

  }
  render () {
    const {folder} = this.props;
    let icon;
    if(!this.state.file) {
      icon= (<button className='btn-sm btn' style={{background: 'green', color: 'white',marginRight: '10px'}}
                     onClick={this.onDownload.bind(this)}><i className="fa fa-download" aria-hidden="true"/>
      </button>)
    }else {
      icon = (<button className='btn-sm btn' style={{background: 'white',marginRight: '10px'}}><img
        src={downloading}
        style={{ width: '25px', margin: 'auto', display: 'block' }}
        alt="downloading..."
      />
      </button>)
    }

    return (
      //onTouchStart="this.classList.toggle('hover');
      <div className="">
        <div className="image-flip" >
          <div className="mainflip">
            <div className="frontside">

              <div className="card" style={{minWidth: '200px', borderStyle: 'solid'}}>
                <Link to={`displayFiles/${folder._id}`} style={{ borderStyle: 'none', background: 'white'}} ><span>
                <div className="card-body text-center">
                  <p><img className="img-fluid" src={require('../folder.png')} alt=''/></p>
                  <div className='row text-center d-flex justify-content-center'>
                    <h4 className="card-title" style={{fontSize: '18px'}}>{folder.lastUploadAt}</h4>
                  </div>
                </div>
                </span>
                </Link>
                <div className="card-footer d-flex justify-content-around">
                  {icon}
                  <button className='btn-sm btn' style={{background: 'red', color: 'white',marginLeft: '10px'}}
                          onClick={this.onDelete.bind(this)}><i className="fa fa-trash" aria-hidden="true"/>
                  </button>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

FolderItem.propTypes = {
  folder: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, {downloadFolder, deleteFolder})(FolderItem);