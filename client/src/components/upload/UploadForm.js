import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { changePassword } from '../../actions/profileActions'

import classnames from 'classnames'
import TextFieldGroup from '../common/TextFieldGroup'
import { continueToUpload, deleteResidual, getPatientDetails } from '../../actions/dAActions'
import Spinner from '../common/Spinner'
import UploadFiles from './UploadFiles'
import Modal from 'react-modal'


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

class UploadForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      patient: '',
      modalIsOpen: false,
      uploadModal: false,
      errors: {}
    }

    this.changeHandler = this.changeHandler.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.closeFlushModal = this.closeFlushModal.bind(this)
    this.openNextModal = this.openNextModal.bind(this)
    this.onDiscard = this.onDiscard.bind(this)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  openModal () {
    this.setState({ modalIsOpen: true })
  }

  openNextModal () {
    this.setState({ uploadModal: true })
    const userData = {
      patient: this.state.patient
    }
    this.props.continueToUpload(userData)
  }

  afterOpenModal () {

  }

  onDiscard () {
    this.setState({ modalIsOpen: false, patient: '' })
    const mid = {
      mid: this.props.home.mid.mid
    }
    this.props.deleteResidual(mid)
  }

  closeFlushModal () {
    this.setState({ modalIsOpen: false, patient: '' })
  }

  closeModal () {
    this.setState({ modalIsOpen: false })
  }


  onSubmit (e) {
    e.preventDefault()
    this.setState({ modalIsOpen: true })
    const userData = {
      patient: this.state.patient
    }
    console.log({ user: userData })
    if (this.state.patient.length !== 0) {
      console.log({ len: 'not zero' })
      // this.props.getDetails(userData);
      this.props.getPatientDetails(userData)
      this.setState({ patient: userData.patient })
    } else {
      this.setState({ errors: { patient: 'Please enter the MR No' }, patient: '' })
    }
  }



  render () {
    const { errors } = this.state
    let showModal
    if (!this.state.uploadModal) {
      const { loading2, patientData } = this.props.home
      if (loading2 || patientData === null) {
        showModal = <Spinner/>
      } else {
        if (patientData.invalid) {
          showModal = (
            <div id="mainbar" className='row d-flex justify-content-center'>
              <div className="grid text-center col-md-10">
                <h3 className="grid--cell fl1 fs-headline1 text-center" style={{
                  color: 'black'
                }}> Patient Details</h3>
              </div>
              <div className='col-md-2'>
                <button onClick={this.closeFlushModal}
                        style={{ borderStyle: 'none', background: 'white', color: 'red' }}
                ><i className="fa fa-times fa-2x" aria-hidden="true"/>
                </button>
              </div>
              <p style={{ color: 'red', fontStyle: 'italic' }}>You have entered invalid MR number</p>
              <div className="col-md-6 text-center" style={{ width: '100%' }}>
                <button onClick={this.closeFlushModal} className='btn btn-warning'>Close</button>
              </div>
            </div>
          )

        } else {
          showModal = (
            <div id="mainbar" className='row d-flex justify-content-center'>
              <div className="grid text-center col-md-10">
                <h3 className="grid--cell fl1 fs-headline1 text-center" style={{
                  color: 'black'
                }}> Confirm Details</h3>
              </div>
              <div className='col-md-2'>
                <button onClick={this.closeFlushModal} style={{ borderStyle: 'none', background: 'white', color: 'red' }}
                ><i className="fa fa-times fa-2x" aria-hidden="true"/>
                </button>
              </div>

              <div className="col-md-12" style={{ width: '100%' }}>
                <div className='row'>
                  <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                    <td><h6 style={{color: 'grey',opacity:'0.9'}}>First Name:</h6></td>
                    <td><h6>{patientData.patient.firstName}</h6></td>
                  </div>
                  <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                    <td><h6 style={{color: 'grey',opacity:'0.9'}}>Last Name:</h6></td>
                    <td><h6>{patientData.patient.lastName}</h6></td>
                  </div>
                </div>
                <div className='row' >
                  <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                    <td><h6 style={{color: 'grey',opacity:'0.9'}}>Age/Gender:</h6></td>
                    <td><h6>{patientData.patient.age+'/'+patientData.patient.gender}</h6></td>
                  </div>
                  <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                    <td><h6 style={{color: 'grey',opacity:'0.9'}}>CentreCode:</h6></td>
                    <td><h6>{patientData.patient.address}</h6></td>
                  </div>
                </div>
                <div className='row' >
                  <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                    <td><h6 style={{color: 'grey',opacity:'0.9'}}>District:</h6></td>
                    <td><h6>{patientData.patient.district}</h6></td>
                  </div>
                  <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                    <td><h6 style={{color: 'grey',opacity:'0.9'}}>State:</h6></td>
                    <td><h6>{patientData.patient.state}</h6></td>
                  </div>
                </div>
                <div className='row' >
                  <div className='col-md-10 d-flex justify-content-between' style={{borderStyle:'groove', margin:'10px'}}>
                    <td><h6 style={{color: 'grey',opacity:'0.9'}}>Country:</h6></td>
                    <td><h6>{patientData.patient.country}</h6></td>
                  </div>
                </div>

                <div className='row d-flex justify-content-around'>
                  <button onClick={this.openNextModal} className='btn btn-sm'
                          style={{ background: 'green', color: 'white' }}>Continue to upload
                  </button>
                  <button onClick={this.closeFlushModal} className='btn btn-warning'
                          style={{ background: 'red', color: 'white' }}>discard
                  </button>
                </div>

              </div>
            </div>
          )
        }
      }
    } else {
      console.log(this.props.home.patientData)
      if(this.props.home.patientData.mid===null) {
        showModal=<Spinner/>
      }else {
        showModal = (
          <div>
            <UploadFiles/>
            <div className='row d-flex justify-content-around'>
              <button onClick={this.onDiscard} className='btn btn-warning'
                      style={{ background: 'red', color: 'white' }}>discard
              </button>
            </div>
          </div>
        )
      }
    }
    return (
      <div className="container-fluid uploadForm d-flex justify-content-center" >
        <div className="col-md-4" style={{ width: '100%' }}>
          <h3 className='text-center' style={{
            borderStyle: 'solid', borderWidth: '2px', background: 'green',
            color: 'white', borderRadius: '2px'
          }}>Enter the Patient MR number to upload files</h3>

          <form noValidate onSubmit={this.onSubmit}>
            <TextFieldGroup placeholder="Enter Patient MR.No" error={errors.patient}
                            type="text" onChange={this.changeHandler} value={this.state.patient} name="patient"
            />
            <input type="submit" className="btn btn-info btn-block mt-4"/>
          </form>
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
        >{showModal}</Modal>
      </div>
    )
  }
}

UploadForm.propTypes = {
  getPatientDetails: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  continueToUpload: PropTypes.func.isRequired,
  deleteResidual: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  home: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  home: state.home
})

export default connect(mapStateToProps, { getPatientDetails,continueToUpload, deleteResidual })(UploadForm)
