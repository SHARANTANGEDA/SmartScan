import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAllPatients, getDiagUserHome, getSADetails } from '../../actions/homeActions'
import TextFieldGroup from '../common/TextFieldGroup'
import Spinner from '../common/Spinner'
import SADashboard from '../SuperAdmin/SADashboard'
import { continueToUpload, deleteResidual, getDAHome, getPatientDetails } from '../../actions/dAActions'
import Modal from 'react-modal'
import UploadFiles from '../upload/UploadFiles'
import LVPEIHomeFeed from './LVPEIHomeFeed'
import classnames from 'classnames'
import Select from 'react-select'
import Card from 'react-bootstrap/Card'
import SearchBar from './SearchBar'
import getAge from '../../utils/getAge'
import TableRowDiagUser from '../SuperAdmin/tableDisplay/TableRowDiagUser'

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
      category: { value: 'all', label: 'Choose Time' },
      campusCode: { value: 'all', label: 'Choose Campus' },
      showPatient: null,
      currentPage: 1,
      todosPerPage: 25
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
    this.codeSelect = this.codeSelect.bind(this)
    this.handleClick = this.handleClick.bind(this);

  }
  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }
  componentDidMount () {
    if (this.props.auth.user.role === 'lvpei') {
      this.props.getAllPatients(this.props.match.params.id)
    } else if (this.props.auth.user.role === 'super_admin') {
      this.props.getSADetails(this.props.match.params.id)
    } else if (this.props.auth.user.role === 'diag_admin') {
      this.props.getDAHome(this.props.match.params.id)
    } else if(this.props.auth.user.role === 'diag') {
      this.props.getDiagUserHome(this.props.match.params.id)
    }
  }

  openModal () {
    this.setState({ modalIsOpen: true })
  }

  openNextModal () {
    this.setState({ uploadModal: true })
    const userData = {
      patient: this.state.patient,
      centre: this.props.auth.user.campusCode
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
      patient: this.state.patient,
      centre: this.props.auth.user.campusCode
    }
    if (this.state.patient.length !== 0) {
      // this.props.getDetails(userData);
      this.props.getPatientDetails(userData)
      this.setState({ patient: userData.patient})
    } else {
      this.setState({ errors: { patient: 'Please enter the MR No' }, patient: ''})
    }
  }
  onSelectType (e) {
    this.setState({category: e})
  }
  codeSelect(e) {
    this.setState({campusCode: e})
  }
  onConfirmSelect (e) {
    if(this.state.category.value==='all') {
      this.setState({showPatient: this.props.folder.patients.all})
    } else if(this.state.category.value==='today') {
      this.setState({showPatient: this.props.folder.patients.today})
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
    const { errors, category,campusCode } = this.state
    if (this.props.auth.user.role === 'lvpei') {
      const { loading, notFound, patients } = this.props.folder
      let allFoldersContent
      if (loading || patients===null || patients===[]) {
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
                <LVPEIHomeFeed patients={this.props.folder.patients.all} campusCode={this.state.campusCode.value}/>
              )
            }else {
              allFoldersContent = (
                <LVPEIHomeFeed patients={this.state.showPatient} campusCode={this.state.campusCode.value}/>
              )
          }
        }
      }
      return (
        <div className="display ">
          <div className='App-content row d-flex justify-content-center'>
            <nav className='navbar navbar-expand-sm  col-md-12' style={{background:'#ffa726', width:'100%'}}>
              <div className='row col-md-8 d-flex justify-content-start'>
                <div className='col-md-4'>
                  <Select options={[{ value: 'all', label: 'All' },{value:'today', label: 'Today'},
                    {value:'yesterday', label: 'Yesterday'},
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
                <div className='col-md-4'>
                  <Select
                    options={[{ value: 'all', label: 'All' },{ value: 'karmn', label: 'KAR' },
                      { value: 'kvcmn', label: 'KVC' }, { value: 'gmrmn', label: 'GMRV' }, { value: 'blvmn', label: 'MTC' }]}
                    className={classnames('isSearchable', { 'is-invalid': errors.campusCode })}
                    placeholder="Campus Code"
                    name="campusCode" value={campusCode} onChange={this.codeSelect}>
                  </Select>
                </div>

              </div>
              <SearchBar/>
            </nav>
          </div>

          <div className="App-content row d-flex justify-content-center">
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
        <div className='dashboard' style={{width: '100%', minHeight:'100%'}}>
          {showContent}

        </div>
      )
    } else if (this.props.auth.user.role === 'diag_admin' || this.props.auth.user.role === 'diag') {
      const { loading, home } = this.props.home
      let showContent, showModal,
        showForm = (
          <div className="col-md-8" style={{ width: '100%' }}>
            <h4 className='text-center' style={{
              borderStyle: 'solid', borderWidth: '2px', background: 'green',
              color: 'white', borderRadius: '2px'
            }}>Enter Patient MR No to upload files</h4>

            <form noValidate onSubmit={this.onSubmit}>
              <TextFieldGroup placeholder="Enter Patient MR.No" error={errors.patient}
                              type="text" onChange={this.changeHandler} value={this.state.patient} name="patient"
              />
              <div className="col-md-12 d-flex justify-content-center text-center">
              <input style={{maxWidth:'300px'}} type="submit" value='Confirm Details' className="btn btn-info btn-block mt-4"/>
              </div>
              </form>
          </div>
        )
      if (this.props.auth.user.role === 'diag_admin') {
        let tableContent, renderpn=null
        const {  currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const pageNumbers = [];
        if (loading || home === null) {
          showContent = <Spinner/>
        } else {
          if(home.users===null || home.details ===null) {
            showContent = <Spinner/>
          } else{
            const currentFolder = home.users.slice(indexOfFirstTodo, indexOfLastTodo);
            const render = (  currentFolder.map(folder => (
              <TableRowDiagUser data={folder} key={folder._id}/>
            )))
            for (let i = 1; i <= Math.ceil(home.users.length / todosPerPage); i++) {
              pageNumbers.push(i);
            }
            const renderPageNumbers = (
              pageNumbers.map(number => {
                return (
                  <button className='page-item page-link'
                          key={number}
                          id={number}
                          onClick={this.handleClick}
                  >
                    {number}
                  </button>
                );
              }))
            tableContent=render
            renderpn= (
              <nav aria-label="...">
                <ul className="pagination pagination-sm">
                  {renderPageNumbers}
                </ul>
              </nav>
            )
            showContent = (
              <div className='row'>
                <div className='row'>
                  <div className="grid text-center col-md-12">
                    <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                      color: 'black'
                    }}>L V Prasad Cloud</h1>
                  </div>
                  <div className='row col-md-12 d-flex justify-content-around'>
                    <Card style={{
                      backgroundColor: '#ffa726', marginRight: '20px', padding:'5px', minWidth:'250px'
                    }}>
                      <div className='row d-flex justify-content-between'>
                        <div className=' col-md-8'>
                          <p style={{ color: 'white' }}>Users</p>
                          <img style={{width:'auto'}} src={require('../../img/SAIcons/centerUser.png')} alt=''/>
                        </div>
                        <div className='d-flex justify-content-end col-md-4'>
                          <h1 style={{ color: 'white', fontWeight: 'bold' }}>
                            {home.users.length}
                          </h1>
                        </div>
                      </div>
                    </Card>
                    <Card style={{
                      backgroundColor: '#4caf50', marginRight: '20px', padding:'5px', minWidth:'250px'
                    }}>
                      <div className='row d-flex justify-content-between'>
                        <div className=' col-md-8'>
                          <p style={{ color: 'white' }}>My Uploads</p>
                          <img style={{width:'auto'}} src={require('../../img/SAIcons/patient.png')} alt=''/>
                        </div>
                        <div className='d-flex justify-content-end col-md-4'>
                          <h1 style={{ color: 'white', fontWeight: 'bold' }}>
                            {home.myUploads}
                          </h1>
                        </div>
                      </div>
                    </Card>
                    <Card style={{
                      backgroundColor: '#f44336', marginRight: '20px', padding:'5px', minWidth:'250px'
                    }}>
                      <div className='row d-flex justify-content-between'>
                        <div className=' col-md-8'>
                          <p style={{ color: 'white' }}>Centre Uploads</p>
                          <img style={{width:'auto'}} src={require('../../img/SAIcons/patient.png')} alt=''/>
                        </div>
                        <div className='d-flex justify-content-end col-md-4'>
                          <h1 style={{ color: 'white', fontWeight: 'bold' }}>
                            {home.totalUploads}
                          </h1>
                        </div>
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
                      <table className="table table-bordered mb-0">
                        <thead>
                        <tr>
                          <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Username</th>
                          <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}} >Full Name</th>
                          <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Created On</th>
                          <th scope='col' style={{ fontSize: '10pt', background:'#c1c1c1'}}>Total Uploads</th>
                          <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Edit</th>
                          <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}} >Manage</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableContent}
                        </tbody>
                      </table>
                    </div>
                    <div className='d-flex justify-content-end'>
                      {renderpn}
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        }
      } else if (this.props.auth.user.role === 'diag') {
        const {loading4, diagUserHome} = this.props.home
        if(loading4 || diagUserHome===null) {
          showContent= (
            <Spinner/>
          )
        }else {
          showContent = (
            <div className='row d-flex justify-content-center'>
              <div className=" grid text-center col-md-12">
                <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                  color: 'black'
                }}> Welcome to L V Prasad MRI Cloud</h1>
              </div>
              <div className='row col-md-12 d-flex justify-content-center'>
                <div className='row col-md-6 d-flex justify-content-around' style={{}}>
                  <div className='row'>
                    <Card style={{margin:'10px',
                      backgroundColor: '#4caf50', marginRight: '20px', padding:'5px', minWidth:'250px'
                    }}>
                      <div className='row d-flex justify-content-between'>
                        <div className=' col-md-8'>
                          <p style={{ color: 'white' }}>My Uploads</p>
                          <img style={{width:'auto'}} src={require('../../img/SAIcons/patient.png')} alt=''/>
                        </div>
                        <div className='d-flex justify-content-end col-md-4'>
                          <h1 style={{ color: 'white', fontWeight: 'bold' }}>
                            {diagUserHome.myUploads}
                          </h1>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className='row'>
                    <Card style={{margin:'10px',
                      backgroundColor: '#f44336', marginRight: '20px', padding:'5px', minWidth:'250px'
                    }}>
                      <div className='row d-flex justify-content-between'>
                        <div className=' col-md-8'>
                          <p style={{ color: 'white' }}>Centre Uploads</p>
                          <img style={{width:'auto'}} src={require('../../img/SAIcons/patient.png')} alt=''/>
                        </div>
                        <div className='d-flex justify-content-end col-md-4'>
                          <h1 style={{ color: 'white', fontWeight: 'bold' }}>
                            {diagUserHome.totalUploads}
                          </h1>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
                <div className='row d-flex justify-content-center col-md-6'>
                  {showForm}
                </div>
              </div>
            </div>
          )
        }
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
                <div className="col-md-12" style={{ width: '100%' }}>
                  <div className='row'>
                    <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>First Name:</h6></td>
                      <td><h6>{patientData.patient.first_name}</h6></td>
                    </div>
                    <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>Last Name:</h6></td>
                      <td><h6>{patientData.patient.last_name}</h6></td>
                    </div>
                  </div>
                  <div className='row' >
                    <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>Age/Gender:</h6></td>
                      <td><h6>{getAge(patientData.patient.dob)+'/'+patientData.patient.gender}</h6></td>
                    </div>
                    <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>CentreCode:</h6></td>
                      <td><h6>{patientData.centreCode}</h6></td>
                    </div>
                  </div>
                  <div className='row' >
                    <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>District:</h6></td>
                      <td><h6>{patientData.patient.district_name}</h6></td>
                    </div>
                    <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>State:</h6></td>
                      <td><h6>{patientData.patient.state_name}</h6></td>
                    </div>
                  </div>
                  <div className='row' >
                    <div className='col-md-10 d-flex justify-content-between' style={{borderStyle:'groove', margin:'10px'}}>
                      <td><h6 style={{color: 'grey',opacity:'0.9'}}>Country:</h6></td>
                      <td><h6>{patientData.patient.country_name}</h6></td>
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
  getDiagUserHome: PropTypes.func.isRequired,
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
  deleteResidual, getAllPatients, getDiagUserHome
})(Dashboard)
