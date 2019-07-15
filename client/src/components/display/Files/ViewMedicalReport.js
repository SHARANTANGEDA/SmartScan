import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextAreaFieldGroup from '../../common/TextAreaGroupField'
import { submitMedicalReport } from '../../../actions/homeActions'
import classnames from 'classnames'

class ViewMedicalReport extends Component {
  constructor (props) {
    super(props)
    this.state = {
      reportDetailed: '',
      editMode: false,
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.enterEditMode = this.enterEditMode.bind(this)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  componentDidMount () {
    this.setState({ reportDetailed: this.props.report })
  }

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  enterEditMode () {
    this.setState({ editMode:true })

  }

  onSubmit (e) {
    e.preventDefault()
    const userData = {
      reportDetailed: this.state.reportDetailed,
    }
    if (this.state.reportDetailed.length !== 0) {
      console.log({ len: 'not zero' })
      // this.props.getDetails(userData);
      this.props.submitMedicalReport(this.props.patientId, userData)
    } else {
      this.setState({ errors: { reportDetailed: 'Please enter the Report' }, reportDetailed: '' })
    }
  }

  render () {
    const { errors } = this.state
    const { loading, details } = this.props.account
    let profileContent = null

    if (this.state.editMode) {
      profileContent = (
        <div className="col-md-12" style={{ width: '100%' }}>
          <h3 className='text-center' style={{
            borderStyle: 'solid', borderWidth: '2px', background: 'green',
            color: 'white', borderRadius: '2px'
          }}>Enter the Patient medical report Below</h3>

          <form noValidate onSubmit={this.onSubmit}>
            <TextAreaFieldGroup placeholder="Enter Patient Investigation Details" error={errors.reportDetailed}
                                type="text" onChange={this.onChange} value={this.state.reportDetailed}
                                name="reportDetailed"
            />
            <div className="col-md-12 d-flex justify-content-center text-center">
              <input style={{ maxWidth: '250px' }} type="submit" value='Confirm'
                     className="btn btn-info btn-block mt-4"/>
            </div>
          </form>
        </div>
      )
    } else {
      profileContent = (
        <div>
          <div className="col-md-12">
            <div className="row col-md-12 m-auto">
              <div className="col-md-120" style={{ color: 'black' }}>
                <h1>Patient Investigation</h1></div>
            </div>
            <div className="col-md-12 m-auto">
              <div className="form-group">
                  <textarea readOnly rows={10}
                className={classnames('form-control form-control-lg', {
                  'is-invalid': errors.reportDetailed
                })}
                placeholder='Enter Patient Investigation Details'
                name='reportDetailed'
                value={this.state.reportDetailed}
                onChange={this.onChange}
                   />
                {errors.reportDetailed && <div className="invalid-feedback">{errors.reportDetailed}</div>}
              </div>

            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container bootstrap snippet editProfile" style={{ maxWidth: '100%' }}>
        <button className='btn btn-info' onClick={this.enterEditMode}>
          Edit
        </button>
        {profileContent}
      </div>
    )
  }
}

ViewMedicalReport.propTypes = {
  errors: PropTypes.object.isRequired,
  submitMedicalReport: PropTypes.func.isRequired,
  updateInfo: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  report: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  errors: state.errors,
  account: state.account
})

export default connect(mapStateToProps, { submitMedicalReport })(ViewMedicalReport)
