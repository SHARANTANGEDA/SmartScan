import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { changePassword } from '../../actions/profileActions'

import classnames from 'classnames'
import { getProfileInfo, updateInfo } from '../../actions/accountActions'
import Spinner from '../common/Spinner'

class EditProfile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
     userName: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
    if(nextProps.account.loading===false && nextProps.account.details!==null) {
      this.setState({
        userName: nextProps.account.details.emailId,
        firstName: nextProps.account.details.firstName,
        lastName: nextProps.account.details.lastName
      })
    }
  }
  componentDidMount () {
    this.props.getProfileInfo(this.props.match.params.id)
  }

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit (e) {
    e.preventDefault()
    const profileData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName
    }
    this.props.updateInfo(profileData)
  }

  render () {
    const { errors } = this.state
    const {loading, details} = this.props.account
    let profileContent=null
    if(loading || details===null) {
      profileContent = (<Spinner/>)
    } else {
      profileContent = (
        <div>
          <div className="col-sm-9">
            <div className="row col-md-8 m-auto">
              <div className="col-sm-10" style={{ color: 'black'}}>
                <h1>My Account</h1></div>
            </div>
            <div className="col-md-8 m-auto">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="user_name"><h6>User Name</h6></label>

                  <input readOnly
                         className='form-control form-control-lg'
                         name="userName"
                         type="text"
                         value={this.state.userName}/>

                </div>
                <div className="form-group">
                  <label htmlFor="first_name"><h6>First name</h6></label>
                  <input
                    className={classnames('form-control form-control-lg', { 'is-invalid': errors.firstName })}
                    name="firstName" type="text"
                    value={this.state.firstName} onChange={this.onChange}/>
                  {errors.firstName && (<div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="last_name"><h6>Last name</h6></label>

                  <input
                    className={classnames('form-control form-control-lg', { 'is-invalid': errors.lastName })}
                    name="lastName" type="text"
                    value={this.state.lastName} onChange={this.onChange}/>
                  {errors.lastName && (<div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>

                <div className="form-group">
                  <div className="col-xs-12">
                    <button className="btn btn-primary w-30 my-1" type="submit">Confirm Change</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="container bootstrap snippet editProfile" style={{ maxWidth: '100%' }}>
        {profileContent}
      </div>
    )
  }
}

EditProfile.propTypes = {
  errors: PropTypes.object.isRequired,
  getProfileInfo: PropTypes.func.isRequired,
  updateInfo: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  errors: state.errors,
  account: state.account
})

export default connect(mapStateToProps, { updateInfo, getProfileInfo })(EditProfile)
