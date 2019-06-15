import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'

class TableRowLVPEI extends Component {
  // constructor () {
  //   super()
  //
  // }

  render () {
    const { data } = this.props
    let content
    if (this.props.data.access) {
      content = (
        <span style={{ fontSize: '13.3333330154419px', background: 'red', color: 'white', borderRadius: '5px' }}>
          <button className=" btn btn-sm"
                  style={{ background: 'red', color: 'white', borderRadius: '5px' }}>Revoke</button>
        </span>
      )
    } else {
      content = (
        <span style={{ fontSize: '13.3333330154419px', background: 'green', color: 'white' }}>
          <button className=" btn btn-success" style={{ background: 'green', color: 'white', borderRadius: '5px' }}>
            Give Access</button>
        </span>
      )
    }
    return (
      <tr className="">
        <td><span style={{ fontFamily: 'Arial', fontSize: '12pt' }}>{data.emailId}</span></td>
        <td>
          <Link to="" style={{ fontFamily: 'Arial', fontSize: '12pt' }}>{data.time}</Link>
        </td>
        <td>
          {content}
        </td>
      </tr>
    )
  }
}

TableRowLVPEI.defaultProps = {
  showActions: true
}

TableRowLVPEI.propTypes = {
  data: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth,
  faculty: state.faculty
})
export default connect(mapStateToProps, {})(TableRowLVPEI)
