import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import TextFieldGroup from '../common/TextFieldGroup'
import { addDiagnostics } from '../../actions/sAActions'
import Select from 'react-select'
import classnames from 'classnames'
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
      firstName: '',
      lastName: '',
      short: '',
      category: null,
      errors: {}
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onSelectType = this.onSelectType.bind(this)
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
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      repassword: this.state.repassword,
      short: this.state.short,
      centreCode: this.state.category.value
    }
     this.props.addDiagnostics(newDiagnostic);
  }
  onSelectType (e) {
    this.setState({category: e})
  }

  render () {
    let scanTypeArray=[{ value: 'karmn', label: 'KAR' },{ value: 'kvcmn', label: 'KVC' },{ value: 'gmrmn', label: 'GMRV' },
      { value: 'blvmn', label: 'MTC' }]
    const { errors } = this.state
    return (
      <div className="addDiagnosticCentre">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 m-auto">
              <div className="col-sm-12" style={{ color: 'black'}}>
                <h2>Add a new Diagnostic Centre</h2></div>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup placeholder="Enter centre Admin user name" error={errors.adminId}
                                info="Please use unique username"
                                type="text" onChange={this.onChange} value={this.state.adminId} name="adminId"
                />
                <div className='row'>
                  <div className='col-md-6'>
                    <TextFieldGroup placeholder="Enter admin First Name" error={errors.firstName}
                                    type="text" onChange={this.onChange} value={this.state.firstName} name="firstName"
                    />
                  </div>
                  <div className='col-md-6'>
                    <TextFieldGroup placeholder="Enter admin Last Name" error={errors.lastName}
                                    type="text" onChange={this.onChange} value={this.state.lastName} name="lastName"
                    />
                  </div>
                </div>

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
                <TextFieldGroup placeholder="Enter centre shortcut" error={errors.short}
                                type="text" onChange={this.onChange} value={this.state.short} name="short"
                                info='Please try to make it unique for better classification'
                />
                <Select options={scanTypeArray} className={classnames('isSearchable')}
                        placeholder="Choose the centre to allocate" style={{minWidth:'250px'}}
                        name="category" value={this.state.category} onChange={this.onSelectType}>
                </Select>
                <div className="col-xs-12">
                  <input type="submit" className="btn btn-info btn-block mt-4 btn-primary w-30 my-1"/>
                </div>
              </form>
            </div>
          </div>
        </div>
        <footer className="d-flex justify-content-center text-white mt-5 p-4 text-center" style={{ height:'50px',left:0,
          bottom:0,background:'#008cff',width:'100%',
          right:0}}>
          Copyright &copy; {new Date().getFullYear()} L V Prasad Eye Institute
        </footer>
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