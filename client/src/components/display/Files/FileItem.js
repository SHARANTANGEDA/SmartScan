import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import '../allFolders.css'
import { deleteFile, displayDicom, downloadFile } from '../../../actions/homeActions'
import Modal from 'react-modal'
import getLocalDate from '../../../utils/getLocalDate'
import DwvComponent from '../../DicomWebViewer/DwvComponent'
import dwv from 'dwv'
import '../../DicomWebViewer/DwvComponent.css'
import axios from 'axios'

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
const customStylesII = {
  content: {
    top: '50%',
    left: '50%',
    right: '-25%',
    bottom: '-25%',
    marginRight: '0',
    transform: 'translate(-50%, -50%)'
  }
}
dwv.utils.decodeQuery = dwv.utils.base.decodeQuery
dwv.gui.displayProgress = () => {}
dwv.gui.getElement = dwv.gui.base.getElement
dwv.gui.refreshElement = dwv.gui.base.refreshElement
dwv.image.decoderScripts = {
  'jpeg2000': 'assets/dwv/decoders/pdfjs/decode-jpeg2000.js',
  'jpeg-lossless': 'assets/dwv/decoders/rii-mango/decode-jpegloss.js',
  'jpeg-baseline': 'assets/dwv/decoders/pdfjs/decode-jpegbaseline.js',
  'rle': 'assets/dwv/decoders/dwv/decode-rle.js'
}

// const styles = {
//   canvas: {
//     width: "400px",
//     height: "400px",
//     border: "2px solid black",
//     borderRadius: "5px"
//   },
//   container: {
//     width: "100%",
//     height: "100%"
//   }
// }

class FileItem extends Component {
  constructor () {
    super()
    this.onOpen = this.onOpen.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.state = {
      modalIsOpen: false,
      FileModalIsOpen: false,
      uploadModal: false,
      file: null,
      tools: [ 'WindowLevel'],
      selectedTool: 'Select Tool',
      loadProgress: 0,
      dataLoaded: false,
      dwvApp: null,
      tags: [],
      showDicomTags: false,
      toolMenuAnchorEl: null,
      image: null,
      loaded: false
    }
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.onClick = this.onClick.bind(this)
    this.canvasRef = React.createRef()
  }
  componentDidMount () {
    // this.props.displayDicom({ filename: this.props.file.filename })
    if (!this.state.loaded) {
      axios.post('/api/upload/displayDicom', { filename: this.props.file.filename },
        { responseType: 'arraybuffer' }).then(res => {
        if (res !== null) {
            try {
              console.log({ 'In build': this.props.view })
              let app = new dwv.App()
              app.init({
                'containerDivId': this.props.file.filename.toString(),
                'tools': this.state.tools,
                'shapes': ['Ruler'],
                'isMobile': true
              })
              const canvas = this.canvasRef.current
              if (canvas!==null) {
                app.loadImageObject([{ name: '', filename: '', data: res.data }])
                const ctx = canvas.getContext('2d')
                app.getImage().onload = () => {
                  ctx.drawImage(app.getImage(), 0, 0)
                }
                let self = this
                app.addEventListener('load-progress', event => {
                  console.log({ progress: event.loaded })
                  self.setState({ loadProgress: event.loaded })
                })
                app.addEventListener('load-end', event => {
                  self.setState({ dataLoaded: true })
                  self.setState({ tags: app.getTags() })
                  if (app.isMonoSliceData() && app.getImage().getNumberOfFrames() === 1) {
                    self.setState({ selectedTool: 'ZoomAndPan' })
                  } else {
                    self.setState({ selectedTool: 'Scroll' })
                  }
                })
                this.setState({ dwvApp: app, loaded: true })
              }

            }catch(e) {
              console.log(e)
            }
        }
      }).catch(err => {
          console.log({ err: err })
        }
      )
    }

  }

  onOpen (e) {
    this.props.downloadFile(this.props.file.filename)
  }

  onDelete (e) {
    this.props.deleteFile(this.props.file.filename)
  }

  onClick (e) {
    this.props.displayDicom({ filename: this.props.file.filename })
    this.setState({ FileModalIsOpen: true })

  }

  closeModal () {
    this.setState({ modalIsOpen: false, FileModalIsOpen: false })
  }

  openModal () {
    this.setState({ modalIsOpen: true })
  }

  afterOpenModal () {}

  render () {
    const { file, patient } = this.props
    const { active, loading } = this.props.view
    const {loadProgress} = this.state
    let displayFile = null
    if (loading || active === null) {
      displayFile = null
    } else {
      displayFile = (<DwvComponent file={active}/>)

    }
    let modalContent = (
      <div id="mainbar" className='row d-flex justify-content-center'>
        <div className="grid text-center col-md-10">
          <h3 className="grid--cell fl1 fs-headline1 text-center" style={{
            color: 'black'
          }}>Details</h3>
        </div>
        <table className="table">
          <tbody>
          <tr>
            <td><h6 style={{color: 'grey',opacity:'0.9'}}>Uploaded By:</h6></td>
            <td><h5>{patient.diagCentreName}</h5></td>
          </tr>
          <tr>
            <td><h6 style={{color: 'grey',opacity:'0.9'}}>Organization email Address:</h6></td>
            <td><h5>{patient.diagCentre}</h5></td>
          </tr>
          <tr>
            <td><h6 style={{color: 'grey',opacity:'0.9'}}>uploaded At:</h6></td>
            <td><h5>{getLocalDate(patient.lastUploadAt)}</h5></td>
          </tr>
          <tr>
            <td><h6 style={{color: 'grey',opacity:'0.9'}}>uploaded by user:</h6></td>
            <td><h5>{patient.uploadedBy}</h5></td>
          </tr>
          </tbody>
        </table>
        <div className="col-md-6 text-center" style={{ width: '100%' }}>
          <button onClick={this.closeModal} className='btn btn-sm' style={{ background: 'red', color: 'white' }}>Close
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
                    <div className="card" style={{ minWidth: '200', borderStyle: 'solid', maxWidth:'200px',
                      }}>

                      <div className="card-body text-center">
                        <div className='d-flex justify-content-end'>
                          <button onClick={this.openModal}
                                  style={{ background: 'white', color: 'grey', borderStyle: 'none' }}>
                        <i className="fas fa-info-circle fa-2x"/></button>
                        </div>

                        <div id={this.props.file.filename} >
                          <div className="layerContainer">
                            <div className="dropBox"/>
                            <canvas  ref={this.canvasRef} className="imageLayer"
                                    >
                              Only for HTML5 compatible browsers...</canvas>
                            <img src={this.state.image} alt=''/>
                            <div className="drawDiv"/>
                          </div>
                        </div>
                        <div className='row d-flex justify-content-center'>
                          <h4 className="card-title" style={{ fontSize: '18px',overflow: 'hidden'
                            ,OTextOverflow: 'ellipsis', textOverflow:'ellipsis', whiteSpace: 'nowrap', width:'100%' }}
                          >{name}</h4>
                        </div>
                      </div>
                      <div className="card-footer row d-flex justify-content-between align-content-center">
                        <button className='btn-sm btn'
                                style={{ background: 'green', color: 'white', marginRight: '10px' }}
                                onClick={this.onOpen.bind(this)}><i className="fa fa-download"
                                                                    aria-hidden="true"/></button>
                        <button className='btn-sm btn' onClick={this.onClick.bind(this)}
                                style={{ background: 'blue', color: 'white', marginLeft: '10px' }}
                        ><i className="fas fa-eye"/></button>
                        <button className='btn-sm btn' onClick={this.onDelete.bind(this)}
                                style={{ background: 'red', color: 'white', marginLeft: '10px' }}>
                          <i className="fa fa-trash" aria-hidden="true"/></button>

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
              ariaHideApp={false}
            >{modalContent}</Modal>
          </div>
        </div>
        <Modal
          isOpen={this.state.FileModalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStylesII}
          contentLabel="Dicom File"
          shouldCloseOnOverlayClick={false}
          ariaHideApp={false}
        >{displayFile}</Modal>
      </div>
    )
  }
}

FileItem.propTypes = {
  file: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  downloadFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  displayDicom: PropTypes.func.isRequired,
  view: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth,
  view: state.view
})
export default connect(mapStateToProps, { downloadFile, deleteFile, displayDicom })(FileItem)