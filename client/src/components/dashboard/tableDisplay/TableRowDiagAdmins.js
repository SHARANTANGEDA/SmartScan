import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'

class TableRowDiagAdmins extends Component {
  // constructor () {
  //   super()
  //
  // }
  render () {
    const { data } = this.props
    let content
    if(this.props.data.user.access) {
      content = (
        <span style={{ fontSize: '13.3333330154419px', background: 'red',style: 'white'}}>
          <button className=" btn btn-warning" style={{background: 'red',style: 'white'}}>De-Assign</button>
        </span>
      )
    }else {
      content = (
        <span style={{ fontSize: '13.3333330154419px', background: 'green',style: 'white'}}>
          <button className=" btn btn-success" style={{background: 'green'}}>Give Access</button>
        </span>
      )
    }
    return (
      <tr className="">
        <td><span style={{ fontFamily: 'Arial', fontSize: '12pt' }}>{data.user.diagCentreName}</span></td>
        <td><span style={{ fontFamily: 'Arial', fontSize: '12pt' }}>{data.user.emailId}</span></td>

        <td>
          <Link to="" style={{ fontFamily: 'Arial', fontSize: '12pt' }}>{data.user.time}</Link>
        </td>
        <td>
          <span  style={{ fontFamily: 'Arial', fontSize: '12pt' }}>{data.emp.length}</span>
        </td>
        <td>
          {content}
        </td>
      </tr>
    )
  }
}

TableRowDiagAdmins.defaultProps = {
  showActions: true
}

TableRowDiagAdmins.propTypes = {
  data: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth,
  faculty:state.faculty
})
export default connect(mapStateToProps)(TableRowDiagAdmins)
