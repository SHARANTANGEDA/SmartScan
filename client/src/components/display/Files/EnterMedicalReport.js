import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { submitMedicalReport } from '../../../actions/homeActions'
import TextAreaFieldGroup from '../../common/TextAreaGroupField'


class EnterMedicalReport extends Component {
  constructor (props) {
    super(props)
    this.state = {
      reportDetailed: '',
      errors: {}
    }
    this.changeHandler = this.changeHandler.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  changeHandler (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit (e) {
    e.preventDefault()
    this.setState({ modalIsOpen: true })
    const userData = {
      reportDetailed: this.state.reportDetailed,
    }
    if (this.state.reportDetailed.length !== 0) {
      console.log({ len: 'not zero' })
      // this.props.getDetails(userData);
      this.props.submitMedicalReport(this.props.patientId,userData)
    } else {
      this.setState({ errors: { reportDetailed: 'Please enter the Report' }, reportDetailed: '' })
    }
  }



  render () {
    const { errors } = this.state
    return (
      <div className="container-fluid uploadForm d-flex justify-content-center">
        <div className="col-md-12" style={{ width: '100%' }}>
          <h3 className='text-center' style={{
            borderStyle: 'solid', borderWidth: '2px', background: 'green',
            color: 'white', borderRadius: '2px'
          }}>Enter the Patient medical report Below</h3>

          <form noValidate onSubmit={this.onSubmit}>
            <TextAreaFieldGroup placeholder="Enter Patient Investigation Details" error={errors.reportDetailed}
                            type="text" onChange={this.changeHandler} value={this.state.reportDetailed} name="reportDetailed"
            />
            <div className="col-md-12 d-flex justify-content-center text-center">
              <input style={{ maxWidth: '250px' }} type="submit" value='Confirm'
                     className="btn btn-info btn-block mt-4"/>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

EnterMedicalReport.propTypes = {
  submitMedicalReport: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  home: PropTypes.object.isRequired,
  patientId:PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  home: state.home
})

export default connect(mapStateToProps, { submitMedicalReport })(EnterMedicalReport)
