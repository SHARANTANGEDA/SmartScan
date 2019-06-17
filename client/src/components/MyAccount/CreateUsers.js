import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { registerUser } from '../../actions/authActions'
import TextFieldGroup from '../common/TextFieldGroup'
import { createNewMembers } from '../../actions/dAActions'
// import classnames from 'classnames'
// import Select from 'react-select'

class CreateUsers extends Component {
  constructor () {
    super()
    this.state = {
      emailId: '',
      password: '',
      repassword: '',
      errors: {}
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    // this.onRoleChange = this.onRoleChange.bind(this)
  }

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  // onRoleChange (e) {
  //   console.log({course:e})
  //   this.setState({course: e})
  //   console.log(this.state.tags)
  // }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  onSubmit (e) {
    e.preventDefault()
    const newUser = {
      emailId: this.state.emailId,
      password: this.state.password,
      repassword: this.state.repassword
    }
    console.log(newUser)
    if(this.props.auth.user.role==='super_admin') {
      this.props.registerUser(newUser)
    } else if(this.props.auth.user.role==='diag_admin') {
      this.props.createNewMembers(newUser)
    }

  }

  render () {
    const { errors } = this.state
    let heading
    if(this.props.auth.user.role==='super_admin') {
      heading=(<h1>Create a new LVPEI user account</h1>)
    } else if(this.props.auth.user.role==='diag_admin') {
      heading=(<h2>Create new user for Your Diagnostics</h2>)
    }    return (
      <div className="createUser">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="col-sm-10" style={{ fontFamily: 'Lobster', color: 'black', fontSize: '48px' }}>
                {heading}</div>
              <form className='col-md-8 ' noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup placeholder="User name" error={errors.emailId}
                                info="Please enter unique username for creating account successfully"
                                type="email" onChange={this.onChange} value={this.state.emailId} name="emailId"
                />
                <TextFieldGroup placeholder="Password" error={errors.password}
                                type="password" onChange={this.onChange} value={this.state.password}
                                name="password"
                />
                <TextFieldGroup placeholder="Confirm Password" error={errors.repassword}
                                type="password" onChange={this.onChange} value={this.state.repassword}
                                name="repassword"
                />
                <div className="col-xs-12">
                   <input type="submit" className="btn btn-info btn-block mt-4 btn-primary w-30 my-1"/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CreateUsers.propTypes = {
  registerUser: PropTypes.func.isRequired,
  createNewMembers: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
})

export default connect(mapStateToProps, { registerUser, createNewMembers })(CreateUsers)