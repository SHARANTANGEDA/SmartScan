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
    if(this.props.patients.today.length===0) {
      this.setState({isOpenToday: false })
    }

    if(this.props.patients.yesterday.length===0) {
      this.setState({isOpenYesterday: false })
    }
    if(this.props.patients.lastweek.length===0) {
      this.setState({isOpenLastWeek: false })
    }
    if(this.props.patients.lastMonth.length===0) {
      this.setState({isOpenLastMonth: false })
    }
    if(this.props.patients.previous.length===0) {
      this.setState({isOpenPrevious: false })
    }
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
    let content, content1, content2, content3, content4;
    if(patients.today.length===0) {
      content=(
        <h5> Nothing is uploaded/modified today</h5>
      )
    }else {
      content=(
      <PatientRow folders={patients.today}/>
    )}
    if(patients.yesterday.length===0) {
      content1=(<h5> Nothing was uploaded/modified yesterday</h5>)
    }else {
      content1=(
      <PatientRow folders={patients.yesterday}/>
    )}
    if(patients.lastweek.length===0) {
      content2=(<h5> Nothing was uploaded/modified today</h5>)
    }else {
      content2=(
      <PatientRow folders={patients.lastweek}/>
    )}
    if(patients.lastMonth.length===0) {
     content3= (<h5> Nothing was uploaded/modified last month</h5>)
    }else {
      content3=(
      <PatientRow folders={patients.lastMonth}/>
    )}
    if(patients.previous.length===0) {
     content4=( <h5> Nothing was uploaded/modified Previously</h5>)
    }else {
      content4=(
      <PatientRow folders={patients.previous}/>
    )}
    let caret, caret1, caret2, caret3, caret4;
    if(this.state.isOpenToday) {
      caret=(<i className="fas fa-caret-left"/>)
    }else {
      caret=(<i className="fas fa-caret-down"/>)
    }
    if(this.state.isOpenYesterday) {
      caret1=(<i className="fas fa-caret-left"/>)
    }else {
      caret1=(<i className="fas fa-caret-down"/>)
    }
    if(this.state.isOpenLastWeek) {
      caret2=(<i className="fas fa-caret-left"/>)
    }else {
      caret2=(<i className="fas fa-caret-down"/>)
    }
    if(this.state.isOpenLastMonth) {
      caret3=(<i className="fas fa-caret-left"/>)
    }else {
      caret3=(<i className="fas fa-caret-down"/>)
    }
    if(this.state.isOpenPrevious) {
      caret4=(<i className="fas fa-caret-left"/>)
    }else {
      caret4=(<i className="fas fa-caret-down"/>)
    }
    return (

      <div style={{width: '100%'}}>
        <div style={{width: '100%'}}>
          <button onClick={this.toggle}
                  className=" d-flex justify-content-between align-items-center
                flex-grow-1 w-100"
                  style={{borderRadius: '10px',fontSize: '25px', fontFamily:'lobster', background:'white'}}>
            Today{caret}</button>
          <Collapse isOpened={this.state.isOpenToday} style={{listStyleType: 'none'}}>
                {content}
          </Collapse>
        </div>

        <div style={{width: '100%', borderRadius: '10px'}}>
          <button onClick={this.toggle1}
                  className=" d-flex justify-content-between align-items-center
                flex-grow-1 w-100"
                  style={{borderRadius: '10px',fontSize: '25px', fontFamily:'lobster', background:'white'}}>
            Yesterday{caret1}</button>
          <Collapse isOpened={this.state.isOpenYesterday} style={{listStyleType: 'none'}}>
            {content1}
          </Collapse>
        </div>
        <div style={{width: '100%'}}>
          <button onClick={this.toggle2}
                  className=" d-flex justify-content-between align-items-center
                flex-grow-1 w-100"
                  style={{borderRadius: '10px',fontSize: '25px', fontFamily:'lobster', background:'white'}}>
            Last Week{caret2}</button>
          <Collapse isOpened={this.state.isOpenLastWeek} style={{listStyleType: 'none'}}>
            {content2}
          </Collapse>
        </div>
        <div style={{width: '100%'}}>
          <button onClick={this.toggle3}
                  className=" d-flex justify-content-between align-items-center
                flex-grow-1 w-100"
                  style={{borderRadius: '10px',fontSize: '25px', fontFamily:'lobster', background:'white'}}>
            Last Month{caret3}</button>
          <Collapse isOpened={this.state.isOpenLastMonth} style={{listStyleType: 'none'}}>
            {content3}
          </Collapse>
        </div>
        <div style={{width: '100%'}}>
          <button onClick={this.toggle4}
                  className=" d-flex justify-content-between align-items-center
                flex-grow-1 w-100"
                  style={{borderRadius: '10px',fontSize: '25px', fontFamily:'lobster', background:'white'}}>
            Earlier Uploads{caret4}</button>
          <Collapse isOpened={this.state.isOpenPrevious} style={{listStyleType: 'none'}}>
            {content4}
          </Collapse>
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
  patients: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(mapStateToProps)(LVPEIHomeFeed)
