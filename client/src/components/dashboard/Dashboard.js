import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAllPatients, getDetails, getFiles, getHomeFolders, getSADetails } from '../../actions/homeActions'
import TextFieldGroup from '../common/TextFieldGroup'
import Spinner from '../common/Spinner'
import SADashboard from '../SuperAdmin/SADashboard'
import { continueToUpload, deleteResidual, getDAHome, getPatientDetails } from '../../actions/dAActions'
import Modal from 'react-modal'
import ShowTable from '../SuperAdmin/tableDisplay/ShowTable'
import UploadFiles from '../upload/UploadFiles'
import PatientRow from '../display/Patients/PatientRow'

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

class Dashboard extends Component {
  constructor () {
    super()
    this.state = {
      patient: '',
      errors: {},
      modalIsOpen: false,
      uploadModal: false
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

  componentDidMount () {
    if (this.props.auth.user.role === 'lvpei') {
      this.props.getAllPatients(this.props.match.params.id)
    } else if (this.props.auth.user.role === 'super_admin') {
      this.props.getSADetails(this.props.match.params.id)
    } else if (this.props.auth.user.role === 'diag_admin') {
      this.props.getDAHome(this.props.match.params.id)
    }
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

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
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
    if (this.props.auth.user.role === 'lvpei') {
      const { patients, loading, notFound } = this.props.folder
      let allFoldersContent
      if (loading) {
        allFoldersContent = <Spinner/>
      } else {
        if (notFound) {
          allFoldersContent = (
            <div>
              <p>Nothing is uploaded yet, please check back later</p>
            </div>
          )
        } else {
          allFoldersContent = (
            <PatientRow folders={patients}/>
          )
        }
      }
      return (
        <div className="display">
          <div className="App-content row d-flex justify-content-center">
            <div className="grid text-center col-md-12">
              <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                fontFamily: 'Lobster',
                color: 'black', fontSize: '48px'
              }}> Welcome to L V Prasad Cloud</h1>
              <h3>All Patients:</h3>
            </div>
            {allFoldersContent}
          </div>
        </div>
      )
    } else if (this.props.auth.user.role === 'super_admin') {
      const { loading, home } = this.props.home
      let showContent
      if (loading || home === null) {
        showContent = <Spinner/>
      } else {
        showContent = <SADashboard home={home}/>
      }
      return (
        <div className='dashboard'>
          {showContent}

        </div>
      )
    } else if (this.props.auth.user.role === 'diag_admin' || this.props.auth.user.role === 'diag') {
      const { loading, home } = this.props.home
      let showContent, showModal,
        showForm = (
          <div className="col-md-6" style={{ width: '100%' }}>
            <h3 className='text-center' style={{
              borderStyle: 'solid', borderWidth: '2px', background: 'green',
              color: 'white'
              , borderRadius: '2px', fontFamily: 'lobster'
            }}>Enter the Patient MR number to upload files</h3>

            <form noValidate onSubmit={this.onSubmit}>
              <TextFieldGroup placeholder="Enter Patient MR.No" error={errors.patient}
                              type="text" onChange={this.changeHandler} value={this.state.patient} name="patient"
              />
              <input type="submit" className="btn btn-info btn-block mt-4"/>
            </form>
          </div>
        )
      if (this.props.auth.user.role === 'diag_admin') {
        if (loading || home === null) {
          showContent = <Spinner/>
        } else {
          console.log(home.users)
          showContent = (
            <div className='row'>
              <div className='row'>
                <div className="grid text-center col-md-12">
                  <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                    fontFamily: 'Lobster',
                    color: 'black', fontSize: '48px'
                  }}>Welcome to L V Prasad Cloud</h1>

                </div>
                <div className='row col-md-12'>
                  <div className='col-md-6' style={{ borderStyle: 'solid', borderWidth: '2px' }}>
                    <h3 className='text-center' style={{
                      borderWidth: '2px'
                      , borderRadius: '2px', fontFamily: 'lobster'
                    }}>{home.details.centreName} {' '} Admin Dashboard</h3>
                  </div>
                  <div className='row col-md-6 d-flex justify-content-center' style={{
                    borderStyle: 'solid', borderWidth: '2px'
                    , borderRadius: '2px', fontFamily: 'lobster'
                  }}>
                    <h3 className='text-center'>Number of Accounts being used:{' '}{home.users.length}</h3>
                  </div>
                </div>
                <div className='row col-md-12'>
                  <div className="table-wrapper-scroll-y my-custom-scrollbar col-md-6">
                    <h3 className='text-center' style={{
                      borderStyle: 'solid', borderWidth: '2px', background: 'green',
                      color: 'white'
                      , borderRadius: '2px', fontFamily: 'lobster'
                    }}>Users in Your Organization</h3>
                    <table className="table table-bordered table-striped mb-0">
                      <thead>
                      <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Created On</th>
                        <th scope="col">Manage</th>
                      </tr>
                      </thead>
                      <tbody>
                      <ShowTable data={home.users} index={{ type: 'diag_admin_user' }}/>
                      </tbody>
                    </table>
                  </div>
                  {showForm}
                </div>
              </div>
            </div>
          )
        }
      } else if (this.props.auth.user.role === 'diag') {
        showContent = (
          <div className='row d-flex justify-content-center'>
            <div className=" grid text-center col-md-12">
              <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                fontFamily: 'Lobster',
                color: 'black', fontSize: '48px'
              }}> Welcome L V Prasad MRI Cloud</h1>
            </div>
            <div className='d-flex justify-content-center col-md-12'>
              {showForm}
            </div>
          </div>)
      }

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
                    fontFamily: 'Lobster',
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
                    fontFamily: 'Lobster',
                    color: 'black'
                  }}> Confirm the Patient Details below to proceed</h3>
                </div>
                <div className='col-md-2'>
                  <button onClick={this.closeModal} style={{ borderStyle: 'none', background: 'white', color: 'red' }}
                  ><i className="fa fa-times fa-2x" aria-hidden="true"/>
                  </button>
                </div>

                <div className="col-md-6" style={{ width: '100%' }}>
                  <table className="table table-bordered table-striped mb-0">
                    <tbody>
                    <tr>
                      <td><h5>First Name</h5></td>
                      <td><h5>{patientData.patient.firstName}</h5></td>
                    </tr>
                    <tr>
                      <td><h5>Last Name</h5></td>
                      <td><h5>{patientData.patient.lastName}</h5></td>
                    </tr>
                    <tr>
                      <td><h5>LVPEI Centre Code</h5></td>
                      <td><h5>{patientData.patient.centerCode}</h5></td>
                    </tr>
                    <tr>
                      <td><h5>Mobile Number</h5></td>
                      <td><h5>{patientData.patient.phone}</h5></td>
                    </tr>
                    </tbody>
                  </table>
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
        <div className='dashboard'>
          {showContent}
          <div>
            {/*<button onClick={this.openModal}>Open Modal</button>*/}
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
        </div>
      )
    }
  }
}

Dashboard.propTypes = {
  home: PropTypes.object.isRequired,
  getDetails: PropTypes.func.isRequired,
  getSADetails: PropTypes.func.isRequired,
  getDAHome: PropTypes.func.isRequired,
  getPatientDetails: PropTypes.func.isRequired,
  deleteResidual: PropTypes.func.isRequired,
  continueToUpload: PropTypes.func.isRequired,
  getAllPatients: PropTypes.func.isRequired

}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
  folder: state.folder
})
export default connect(mapStateToProps, {
  getDetails, getSADetails, getDAHome,
  getPatientDetails, continueToUpload,
  deleteResidual, getAllPatients
})(Dashboard)
