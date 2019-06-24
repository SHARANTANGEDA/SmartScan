import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import '../allFolders.css'
import { deleteFolder, downloadFolder } from '../../../actions/homeActions'
import downloading from '../../common/downloading.gif'
import Modal from 'react-modal'
import getLocalDate from '../../../utils/getLocalDate'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '0',
    transform: 'translate(-50%, -50%)'
  }
}

class FolderItem extends Component {
  constructor () {
    super();
    this.state = {
      file: false,
      modalIsOpen: false,
      uploadModal: false
    };
    this.onOpen = this.onOpen.bind(this);
    this.onDownload = this.onDownload.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.loadFolders = this.loadFolders.bind(this)
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


  closeModal () {
    this.setState({ modalIsOpen: false })
  }

  openModal () {
    this.setState({ modalIsOpen: true })
  }

  // openNextModal () {
  //   this.setState({ uploadModal: true })
  //   const userData = {
  //     patient: this.state.patient
  //   }
  //   this.props.continueToUpload(userData)
  // }

  afterOpenModal () {

  }
  loadFolders () {
    window.location.href=`/displayFolder/displayFiles/${this.props.folder._id}`
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
    let modalContent = (
      <div id="mainbar" className='row d-flex justify-content-center'>
        <div className="grid text-center col-md-10">
          <h3 className="grid--cell fl1 fs-headline1 text-center" style={{
            color: 'black'
          }}> Upload Details</h3>
        </div>
        <table className="table table-bordered table-striped mb-0">
          <tbody>
          <tr>
            <td><h5>Uploaded By</h5></td>
            <td><h5>{folder.diagCentreName}</h5></td>
          </tr>
          <tr>
            <td><h5>Organization email Address</h5></td>
            <td><h5>{folder.diagCentre}</h5></td>
          </tr>
          <tr>
            <td><h5>uploaded At</h5></td>
            <td><h5>{getLocalDate(folder.lastUploadAt)}</h5></td>
          </tr>
          <tr>
            <td><h5>uploaded by user</h5></td>
            <td><h5>{folder.uploadedBy}</h5></td>
          </tr>
          </tbody>
        </table>
        <div className="col-md-6 text-center" style={{ width: '100%' }}>
          <button onClick={this.closeModal} className='btn btn-warning'>Close</button>
        </div>
      </div>
    )
    return (
      //onTouchStart="this.classList.toggle('hover');
        <tr>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{folder.centreShortCode}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{folder.mrNo}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{folder.firstName+' '+folder.lastName}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px'  }}>{folder.age+'/'+folder.gender}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{getLocalDate(folder.lastUploadAt)}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{folder.scanType}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{folder.remarks}</span></td>

          <td>
            <button onClick={this.loadFolders} className='btn btn-sm'
                  style={{ borderStyle: 'none', background: 'blue', color:'white'}}>View</button>
          </td>
          <td>{icon}
          </td>
          <td>
            <button className='btn-sm btn' style={{background: 'red', color: 'white',marginLeft: '10px'}}
                      onClick={this.onDelete.bind(this)}><i className="fa fa-trash" aria-hidden="true"/></button>
          </td>
        </tr>

    )
  }
}

//
// {/*<div className="">*/}
//
// {/*<div className="image-flip" >*/}
// {/*  <div className="mainflip">*/}
// {/*    <div className="frontside">*/}
//
// {/*      <div className="card" style={{minWidth: '200px', borderStyle: 'solid'}}>*/}
// {/*        <div className='d-flex justify-content-end'>*/}
// {/*          <button onClick={this.openModal}*/}
// {/*                  style={{background:'white', color:'grey', borderStyle:'none'}}>*/}
// {/*            <i className="fas fa-info-circle fa-2x"/></button>*/}
// {/*        </div>*/}
// {/*        <Link to={`displayFiles/${folder._id}`} style={{ borderStyle: 'none', background: 'white'}} ><span>*/}
// {/*        <div className="card-body text-center">*/}
// {/*          <p><img className="img-fluid" src={require('../folder.png')} alt=''/></p>*/}
// {/*          <div className='row text-center d-flex justify-content-center'>*/}
// {/*            <h4 className="card-title" style={{fontSize: '18px'}}>{getLocalDate(folder.lastUploadAt)}</h4>*/}
// {/*          </div>*/}
// {/*        </div>*/}
// {/*        </span>*/}
// {/*        </Link>*/}
// {/*        <div className="card-footer d-flex justify-content-around">*/}
// {/*          {icon}*/}
// {/*          <button className='btn-sm btn' style={{background: 'red', color: 'white',marginLeft: '10px'}}*/}
// {/*                  onClick={this.onDelete.bind(this)}><i className="fa fa-trash" aria-hidden="true"/>*/}
// {/*          </button>*/}
//
// {/*        </div>*/}
// {/*        <Modal*/}
// {/*          isOpen={this.state.modalIsOpen}*/}
// {/*          onAfterOpen={this.afterOpenModal}*/}
// {/*          onRequestClose={this.closeModal}*/}
// {/*          style={customStyles}*/}
// {/*          contentLabel="Patient Data"*/}
// {/*          shouldCloseOnOverlayClick={false}*/}
// {/*          ariaHideApp={false}*/}
// {/*        >{modalContent}</Modal>*/}
// {/*      </div>*/}
//
// {/*    </div>*/}
// {/*  </div>*/}
// {/*</div>*/}
// {/*</div>*/}
FolderItem.propTypes = {
  folder: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, {downloadFolder, deleteFolder})(FolderItem);