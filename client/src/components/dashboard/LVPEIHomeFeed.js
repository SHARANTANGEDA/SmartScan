import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { Collapse } from 'react-collapse'
import PatientRow from '../display/Patients/PatientRow'

class LVPEIHomeFeed extends Component {
  constructor () {
    super()
    this.state = {
      isOpenToday: true,
      isOpenYesterday: true,
      isOpenLastWeek: true,
      isOpenLastMonth: true,
      isOpenPrevious: true,

    }
    this.toggle = this.toggle.bind(this)
    this.toggle1 = this.toggle1.bind(this)
    this.toggle2 = this.toggle2.bind(this)
    this.toggle3 = this.toggle3.bind(this)
    this.toggle4 = this.toggle4.bind(this)

  }
  componentDidMount () {
    // if(this.props.patients.today.length===0) {
    //   this.setState({isOpenToday: false })
    // }
    //
    // if(this.props.patients.yesterday.length===0) {
    //   this.setState({isOpenYesterday: false })
    // }
    // if(this.props.patients.lastweek.length===0) {
    //   this.setState({isOpenLastWeek: false })
    // }
    // if(this.props.patients.lastMonth.length===0) {
    //   this.setState({isOpenLastMonth: false })
    // }
    // if(this.props.patients.previous.length===0) {
    //   this.setState({isOpenPrevious: false })
    // }
  }

  toggle(e) {
    this.setState({isOpenToday: !this.state.isOpenToday})
  }
  toggle1(e) {
    this.setState({isOpenYesterday: !this.state.isOpenYesterday})
  }toggle2(e) {
    this.setState({isOpenLastWeek: !this.state.isOpenLastWeek})
  }toggle3(e) {
    this.setState({isOpenLastMonth: !this.state.isOpenLastMonth})
  }toggle4(e) {
    this.setState({isOpenPrevious: !this.state.isOpenPrevious})
  }

  render () {
    const { patients } = this.props
    let content;
    if(patients.length===0) {
      content=(
        <h5> Nothing is uploaded/modified in this time</h5>
      )
    }else {
      content=(
      <PatientRow folders={patients}/>
    )}

    return (
      <div style={{width: '100%'}}>
        <div style={{width: '100%'}}>
          <table className="table table-bordered table-striped mb-0">
            <thead>
            <tr>
              <th scope="col">Centre</th>
              <th scope="col">MR No</th>
              <th scope="col">Patient Name</th>
              <th scope="col">Age/Gender</th>
              <th scope="col">Date of last upload</th>
              <th scope="col">View</th>
              <th scope="col">Delete</th>
            </tr>
            </thead>
            <tbody>
            {content}
            </tbody>
          </table>
        </div>
      </div>

    )
  }
}

LVPEIHomeFeed.defaultProps = {
  showActions: true
}

LVPEIHomeFeed.propTypes = {
  auth: PropTypes.object.isRequired,
  patients: PropTypes.array.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(mapStateToProps)(LVPEIHomeFeed)
