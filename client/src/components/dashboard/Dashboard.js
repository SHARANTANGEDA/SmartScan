import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../common/Spinner'
import { getDetails } from '../../actions/homeActions'
import TextFieldGroup from '../common/TextFieldGroup'

class Dashboard extends Component {

  componentDidMount () {
    if (this.props.auth.user.role === 'lvpei') {
      //this.props.getQuestionsHome(this.props.match.params.id)
    }
    // else if (this.props.auth.user.role === 'MRI') {
    //   this.props.getHodHome(this.props.match.params.id)
    // }
    console.log('Called')
  }
  constructor () {
    super();
    this.state = {
      patient: '',
      errors: {}
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  changeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  componentWillReceiveProps (nextProps, nextContext) {
    if(nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    if(nextProps) {
      this.setState({errors: nextProps.errors})
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
      const { home, loading, faculty } = this.props
      let dashboardContent
      if ((home === null) || loading) {
        dashboardContent = <Spinner/>
      } else {
        if (!faculty) {
          dashboardContent = (
            <div className="col-md-12">
              <div className="desc">
                <h1 style={{
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 100, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                  fontFamily: '\'Lobster\''
                }}
                    className="rounded border bg-dark text-light text-center p-1 pl-3 pr-5">
                  Department of {home.department.departmentName}</h1>
                <h3 className='text-center'>{home.noFaculty}</h3>
              </div>
            </div>
          )
        } else {
          dashboardContent = (
            <div className="col-md-12">
              <div className="desc">
                <h1 style={{
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 100, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                  fontFamily: '\'Lobster\''
                }}
                    className="rounded border bg-dark text-light p-1 pl-3 pr-5 text-center">Department
                  of {home.department.departmentName}</h1>

                <table className="tableGrid rounded border"
                       style={{
                         boxShadow: '0 4px 8px 0 rgba(0, 0, 100, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                         width: '100%'
                       }}>
                  <tbody>
                  <tr>
                    <td>
                      <strong style={{ fontFamily: 'Arial', fontSize: '14pt' }}>Faculty Name</strong>
                    </td>
                    <td>
                      <strong style={{ fontFamily: 'Arial', fontSize: '14pt' }}>Email Address </strong>
                    </td>
                    <td>
                      <strong style={{ fontFamily: 'Arial', fontSize: '14pt' }}>Personal Website</strong>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        }

      }
      return (
        <div className="container dashboard">
          <div className="row">
            {dashboardContent}
          </div>
        </div>
      )
    }
  }
}

Dashboard.propTypes = {
  home: PropTypes.object.isRequired,
  getDetails: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
})
export default connect(mapStateToProps, {  getDetails })(Dashboard)
