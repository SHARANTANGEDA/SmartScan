import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import '../allFolders.css'
import { deleteFile, downloadFile } from '../../../actions/homeActions'
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

class FileItem extends Component {
  constructor () {
    super()
    this.onOpen = this.onOpen.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.state = {
      modalIsOpen: false,
      uploadModal: false,
      file: null
    }
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    // this.closeFlushModal = this.closeFlushModal.bind(this)
    // this.openNextModal = this.openNextModal.bind(this)
  }

  onOpen (e) {
    this.props.downloadFile(this.props.file.filename)
  }

  onDelete (e) {
    this.props.deleteFile(this.props.file.filename)
  }

  // closeFlushModal () {
  //   this.setState({ modalIsOpen: false, patient: '' })
  // }

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

  render () {
    const { file, patient} = this.props
    let modalContent = (
      <div id="mainbar" className='row d-flex justify-content-center'>
        <div className="grid text-center col-md-10">
          <h3 className="grid--cell fl1 fs-headline1 text-center" style={{
            fontFamily: 'Lobster',
            color: 'black'
          }}> Upload Details</h3>
        </div>
        <table className="table table-bordered table-striped mb-0">
          <tbody>
          <tr>
            <td><h5>Uploaded By</h5></td>
            <td><h5>{patient.diagCentreName}</h5></td>
          </tr>
          <tr>
            <td><h5>Organization email Address</h5></td>
            <td><h5>{patient.diagCentre}</h5></td>
          </tr>
          <tr>
            <td><h5>uploaded At</h5></td>
            <td><h5>{getLocalDate(patient.lastUploadAt)}</h5></td>
          </tr>
          <tr>
            <td><h5>uploaded by user</h5></td>
            <td><h5>{patient.uploadedBy}</h5></td>
          </tr>
          </tbody>
        </table>
        <div className="col-md-6 text-center" style={{ width: '100%' }}>
          <button onClick={this.closeModal} className='btn btn-sm' style={{background:'red', color:'white'}}>Close
          </button>
        </div>
      </div>
    )
    let name = file.filename.substr(file.filename.lastIndexOf(';') + 1, file.filename.length)
    return (
      //onTouchStart="this.classList.toggle('hover');
      <div className="">
        <div className="image-flip">
          <div className="mainflip">
            <div className="frontside">
              {/*<Link to={`/api/upload/downloadFile/${file.filename}`}>*/}
              <span>
                    <div className="card" style={{ minWidth: '200', borderStyle: 'solid' }}>

                      <div className="card-body text-center">
                        <div className='d-flex justify-content-end'>
                          <button onClick={this.openModal}
                            style={{background:'white', color:'grey', borderStyle:'none'}}>
                        <i className="fas fa-info-circle fa-2x"/></button>
                        </div>

                        <p><img className="img-fluid" src={require('../../../img/file.png')} alt=''/></p>
                        <div className='row d-flex justify-content-center'>
                          <h4 className="card-title" style={{ fontSize: '18px' }}>{name}</h4>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-around">
                  <button className='btn-sm btn' style={{ background: 'green', color: 'white', marginRight: '10px' }}
                          onClick={this.onOpen.bind(this)}><i className="fa fa-download" aria-hidden="true"/></button>
                  <button className='btn-sm btn' onClick={this.onDelete.bind(this)}
                          style={{ background: 'red', color: 'white', marginLeft: '10px' }}
                  ><i className="fa fa-trash" aria-hidden="true"/></button>
                </div>
                    </div>
                  </span>
            </div>
            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Patient Data"
              shouldCloseOnOverlayClick={false}
              modalOptions={{ dismissible: false }}
              shouldCloseOnEsc={false}
              ariaHideApp={false}
            >{modalContent}</Modal>
          </div>
        </div>
      </div>
    )
  }
}

FileItem.propTypes = {
  file: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  downloadFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(mapStateToProps, { downloadFile, deleteFile })(FileItem)