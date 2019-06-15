import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import TextFieldGroup from '../common/TextFieldGroup'
import { addDiagnostics } from '../../actions/sAActions'
// import classnames from 'classnames'
// import Select from 'react-select'

class CreateLVPEIUsers extends Component {
  constructor () {
    super()
    this.state = {
      adminId: '',
      orgEmail:'',
      centreName:'',
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
    const newDiagnostic = {
      adminId: this.state.adminId,
      password: this.state.password,
      orgEmail: this.state.orgEmail,
      centreName: this.state.centreName,
      repassword: this.state.repassword
    }
    console.log(newDiagnostic)
     this.props.addDiagnostics(newDiagnostic);
  }

  render () {
    const { errors } = this.state
    return (
      <div className="addDiagnosticCentre">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="col-sm-10" style={{ fontFamily: 'Lobster', color: 'black', fontSize: '48px' }}>
                <h1>Add a new Diagnostic Centre</h1></div>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup placeholder="Enter centre Admin user name" error={errors.adminId}
                                info="Please use unique username"
                                type="text" onChange={this.onChange} value={this.state.adminId} name="adminId"
                />
                <TextFieldGroup placeholder="Password" error={errors.password}
                                type="password" onChange={this.onChange} value={this.state.password}
                                name="password"
                />
                <TextFieldGroup placeholder="Confirm Password" error={errors.repassword}
                                type="password" onChange={this.onChange} value={this.state.repassword}
                                name="repassword"
                />
                <TextFieldGroup placeholder="Enter Organization Name" error={errors.centreName}
                                type="text" onChange={this.onChange} value={this.state.centreName} name="centreName"
                />
                <TextFieldGroup placeholder="Enter organization Email" error={errors.orgEmail}
                                type="text" onChange={this.onChange} value={this.state.orgEmail} name="orgEmail"
                />
                {/*<div className="form-group w-75" style={{marginTop: '10px'}}>*/}
                {/*  <label className="s-label mb4 d-block w-100" htmlFor="wmd-input">*/}
                {/*    <h4>Course</h4>*/}
                {/*  </label>*/}
                {/*<Select options={[{value: 'diag_admin',label: 'Diagnostic Centre Admin'}]} className={classnames("isSearchable",*/}
                {/*  {'is-invalid': errors.role})}*/}
                {/*        placeholder="Select the role of user"*/}
                {/*        name="role" value={role} onChange={this.onRoleChange}>*/}
                {/*</Select>*/}
                {/*{errors.role && (*/}
                {/*  <div className="invalid-feedback">{errors.role}</div>*/}
                {/*)}*/}
                {/*</div>*/}
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

CreateLVPEIUsers.propTypes = {
  addDiagnostics: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
})

export default connect(mapStateToProps, { addDiagnostics })(CreateLVPEIUsers)