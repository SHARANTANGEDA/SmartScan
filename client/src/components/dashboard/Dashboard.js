import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAllPatients, getSADetails } from '../../actions/homeActions'
import TextFieldGroup from '../common/TextFieldGroup'
import Spinner from '../common/Spinner'
import SADashboard from '../SuperAdmin/SADashboard'
import { continueToUpload, deleteResidual, getDAHome, getPatientDetails } from '../../actions/dAActions'
import Modal from 'react-modal'
import ShowTable from '../SuperAdmin/tableDisplay/ShowTable'
import UploadFiles from '../upload/UploadFiles'
import LVPEIHomeFeed from './LVPEIHomeFeed'
import classnames from 'classnames'
import Select from 'react-select'
import Card from 'react-bootstrap/Card'

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
      uploadModal: false,
      category: { value: 'all', label: 'All' },
      showPatient: null
    }
    this.changeHandler = this.changeHandler.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.closeFlushModal = this.closeFlushModal.bind(this)
    this.openNextModal = this.openNextModal.bind(this)
    this.onDiscard = this.onDiscard.bind(this)
    this.onSelectType = this.onSelectType.bind(this)
    this.onConfirmSelect = this.onConfirmSelect.bind(this)
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
  onSelectType (e) {
    this.setState({category: e})
  }
  onConfirmSelect (e) {
    if(this.state.category.value==='all') {
      this.setState({showPatient: this.props.folder.patients.all})
    } else if(this.state.category.value==='today') {
      this.setState({showPatient: this.props.folder.patients.today})
      console.log({NEWSTATE:  this.props.folder.patients.today})
    }else if(this.state.category.value==='yesterday') {
      this.setState({showPatient: this.props.folder.patients.yesterday})

    }else if(this.state.category.value==='lastweek') {
      this.setState({showPatient: this.props.folder.patients.lastweek})

    }else if(this.state.category.value==='lastMonth') {
      this.setState({showPatient: this.props.folder.patients.lastMonth})

    }else if(this.state.category.value==='earlier') {
      this.setState({showPatient: this.props.folder.patients.previous})

    }
  }
  render () {
    const { errors, category } = this.state
    if (this.props.auth.user.role === 'lvpei') {
      const { loading, notFound, patients } = this.props.folder
      let allFoldersContent
      if (loading || patients===null) {
        allFoldersContent = <Spinner/>
      } else {
        if (notFound) {
          allFoldersContent = (
            <div>
              <p>Nothing is uploaded yet, please check back later</p>
            </div>
          )
        } else {
          if(this.state.showPatient === null) {
            allFoldersContent = (
              <LVPEIHomeFeed patients={this.props.folder.patients.all}/>
            )
          }else {
            console.log({'HELLO':this.state.showPatient})
            allFoldersContent = (
              <LVPEIHomeFeed patients={this.state.showPatient}/>
            )
          }

        }
      }
      return (
        <div className="display">
          <div className="App-content row d-flex justify-content-center">
            <div className="grid text-center col-md-12">
              <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                color: 'black', fontSize: '48px'
              }}> Welcome to L V Prasad Cloud</h1>
            </div>
          </div>

          <div className='row col-md-6 d-flex justify-content-start'>
              <div className='col-md-6'>
                <Select options={[{ value: 'all', label: 'All' },{value:'today', label: 'today'},
                  {value:'yesterday', label: 'yesterday'},
                  {value: 'lastweek', label: 'Last Week'}, {value: 'lastMonth', label: 'Last Month'},
                  {value: 'earlier', label: 'earlier'}]} className={classnames('isSearchable',
                  { 'is-invalid': errors.category })}
                        placeholder="Category"
                        name="category" value={category} onChange={this.onSelectType}>
                </Select>
              </div>
              <button onClick={this.onConfirmSelect} className="input-group-text cyan lighten-2">
                <i className="fas fa-search text-grey" aria-hidden="true"/>
              </button>
            </div>

            {allFoldersContent}
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
              color: 'white', borderRadius: '2px'
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
          if(home.users===null || home.details ===null) {
            showContent = <Spinner/>
          } else{
            showContent = (
              <div className='row'>
                <div className='row'>
                  <div className="grid text-center col-md-12">
                    <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                      color: 'black', fontSize: '48px'
                    }}>Welcome to L V Prasad Cloud</h1>
                  </div>
                  <div className='row col-md-12 d-flex justify-content-around'>
                    <Card style={{
                      backgroundColor: '#ffa726', maxHeight: '150px', maxWidth: '200px', marginRight: '20px'
                    }}>
                      <div color="warning" className='text-center'>
                        <p className='' style={{ color: 'white' }}>Number of User Accounts</p>
                        <h1 className='' style={{ color: 'white', fontWeight: 'bold' }}>
                          {home.users.length}
                        </h1>
                      </div>
                    </Card>
                    <Card style={{
                      backgroundColor: '#4caf50', maxHeight: '150px', maxWidth: '200px', marginRight: '20px',
                    }}>
                      <div color="warning" className='text-center'>
                        <p className='' style={{ color: 'white' }}>Number of uploads by You</p>
                        <h1 className='' style={{ color: 'white', fontWeight: 'bold' }}>
                          {home.admin.totalUploads}
                        </h1>
                      </div>
                    </Card>
                    <Card style={{
                      backgroundColor: '#f44336', maxHeight: '150px', maxWidth: '200px', padding: '10px',
                    }}>
                      <div color="warning" className='text-center'>
                        <p className='' style={{ color: 'white' }}>Total Number of Uploads</p>
                        <h1 className='' style={{ color: 'white', fontWeight: 'bold' }}>
                          {home.details.totalUploads}
                        </h1>
                      </div>
                    </Card>
                  </div>

                  <div className='row col-md-12'>
                    <div className="table-wrapper-scroll-y my-custom-scrollbar col-md-12">
                      <h3 className='text-center' style={{
                        borderStyle: 'solid', borderWidth: '2px', background: 'green',
                        color: 'white'
                        , borderRadius: '2px'
                      }}>Users in Your Organization</h3>
                      <table className="table table-bordered table-striped mb-0">
                        <thead>
                        <tr>
                          <th scope="col">Username</th>
                          <th scope="col">Created On</th>
                          <th scope='col'>Total Uploads</th>
                          <th scope="col">Manage</th>
                        </tr>
                        </thead>
                        <tbody>
                        <ShowTable data={home.users} index={{ type: 'diag_admin_user' }}/>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        }
      } else if (this.props.auth.user.role === 'diag') {
        showContent = (
          <div className='row d-flex justify-content-center'>
            <div className=" grid text-center col-md-12">
              <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
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
                  }}> Confirm Details before upload</h3>
                </div>
                <div className='col-md-2'>
                  <button onClick={this.closeModal} style={{ borderStyle: 'none', background: 'white', color: 'red' }}
                  ><i className="fa fa-times fa-2x" aria-hidden="true"/>
                  </button>
                </div>

                <div className="col-md-6" style={{ width: '100%' }}>
                  <table className="table ">
                    <tbody>
                    <tr>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>First Name:</h6></td>
                      <td><h5>{patientData.patient.firstName}</h5></td>
                    </tr>
                    <tr>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>Last Name:</h6></td>
                      <td><h5>{patientData.patient.lastName}</h5></td>
                    </tr>
                    <tr>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>Age/Gender:</h6></td>
                      <td><h5>{patientData.patient.age+'/'+patientData.patient.gender}</h5></td>
                    </tr>
                    <tr>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>Location:</h6></td>
                      <td><h5>{patientData.patient.address}</h5></td>
                    </tr>
                    <tr>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>District:</h6></td>
                      <td><h5>{patientData.patient.district}</h5></td>
                    </tr>
                    <tr>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>State:</h6></td>
                      <td><h5>{patientData.patient.state}</h5></td>
                    </tr><tr>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>Country:</h6></td>
                      <td><h5>{patientData.patient.country}</h5></td>
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
  getSADetails: PropTypes.func.isRequired,
  getDAHome: PropTypes.func.isRequired,
  getPatientDetails: PropTypes.func.isRequired,
  deleteResidual: PropTypes.func.isRequired,
  continueToUpload: PropTypes.func.isRequired,
  getAllPatients: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  folder: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
  folder: state.folder
})
export default connect(mapStateToProps, { getSADetails, getDAHome,
  getPatientDetails, continueToUpload,
  deleteResidual, getAllPatients
})(Dashboard)
