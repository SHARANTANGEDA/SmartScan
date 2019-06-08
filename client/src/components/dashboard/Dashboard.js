import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getDetails, getFiles } from '../../actions/homeActions'
import TextFieldGroup from '../common/TextFieldGroup'
import Spinner from '../common/Spinner'
import FolderRow from '../display/FolderRow'

class Dashboard extends Component {
  constructor () {
    super();
    this.state = {
      patient: '',
      errors: {}
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount () {
    if (this.props.auth.user.role === 'lvpei') {
      this.props.getFiles(this.props.match.params.id)
    }
  }

  changeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  componentWillReceiveProps (nextProps, nextContext) {
    if (this.props.auth.user.role === 'MRI') {
      if (nextProps.auth.isAuthenticated) {
        this.props.history.push('/dashboard');
      }
      if (nextProps) {
        this.setState({ errors: nextProps.errors })
      }
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const userData = {
      name: this.state.patient
    };
    console.log(userData)
    this.props.getDetails(userData);
  }
  render () {
    const {errors} = this.state;
    if (this.props.auth.user.role === 'MRI') {
      return (
        <div className='dashboard' style={{ width: '100%' }}>
          <div id="content" className="snippet-hidden ">
            <div className="inner-content">
              <div id="mainbar" className='row d-flex justify-content-center'>
                <div className="grid text-center col-md-12">
                    <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                      fontFamily: 'Lobster',
                      color: 'black', fontSize: '48px'
                    }}> Welcome L V Prasad MRI Docs Cloud</h1>
                </div>

                <div className="col-md-6 text-center" style={{width: '100%'}}>
                  <p style={{ color: 'white', background: 'green' }} className='btn w-100'>
                    Enter the Details below to upload the images</p>
                  <form noValidate onSubmit={this.onSubmit}>
                    <TextFieldGroup placeholder="Enter Patient Full Name" error={errors.patient}
                                    type="text" onChange={this.changeHandler} value={this.state.patient} name="patient"
                    />
                    <input type="submit" className="btn btn-info btn-block mt-4"/>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (this.props.auth.user.role === 'lvpei') {
      const {folders, loading, notFound} = this.props.folder
      let allFoldersContent;
      if (loading) {
        allFoldersContent = <Spinner/>
      } else {
        if(notFound) {
          allFoldersContent = (
            <div>
              <p>Nothing is uploaded yet, please check back later</p>
            </div>
          )
        }else {
          allFoldersContent = (
              <FolderRow folders={folders}/>
          )
        }
      }
      return (
        <div className="display">
          <div className="App-content row d-flex justify-content-center" >
            <div className="grid text-center col-md-12">
              <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                fontFamily: 'Lobster',
                color: 'black', fontSize: '48px'
              }}> Welcome L V Prasad MRI Docs Cloud</h1>
            </div>
            {allFoldersContent}
          </div>
        </div>
      );
    }
  }
}

Dashboard.propTypes = {
  home: PropTypes.object.isRequired,
  getDetails: PropTypes.func.isRequired,
  getFiles: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
  folder: state.folder
})
export default connect(mapStateToProps, {  getDetails, getFiles })(Dashboard)
