import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { registerUser } from '../../actions/authActions'
import TextFieldGroup from '../common/TextFieldGroup'

class Register extends Component {
  constructor () {
    super()
    this.state = {

      emailId: '',
      password: '',
      repassword: '',
      errors: {}
    }
    this.changeHandler = this.changeHandler.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

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
    this.props.registerUser(newUser, this.props.history)

  }

  render () {
    const { errors } = this.state
    return (
      <div className="createAccount">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="col-sm-10" style={{ fontFamily: 'Lobster', color: 'black', fontSize: '48px' }}>
                <h1>Create a new Lab account</h1></div>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup placeholder="Lab Name" error={errors.emailId}
                                info="Please use unique Lab name"
                                type="email" onChange={this.changeHandler} value={this.state.emailId} name="emailId"
                />
                <TextFieldGroup placeholder="Password" error={errors.password}
                                type="password" onChange={this.changeHandler} value={this.state.password}
                                name="password"
                />
                <TextFieldGroup placeholder="Confirm Password" error={errors.repassword}
                                type="password" onChange={this.changeHandler} value={this.state.repassword}
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
})

export default connect(mapStateToProps, { registerUser })(Register)