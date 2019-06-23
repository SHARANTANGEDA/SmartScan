import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import getLocalDate from '../../utils/getLocalDate'
import Button from 'react-bootstrap/Button'
import { deleteDiagUser } from '../../actions/dAActions'

class TableRowUsers extends Component {
  constructor () {
    super()

    this.onRemoveUser = this.onRemoveUser.bind(this)
  }
  onRemoveUser(e) {
    this.props.deleteDiagUser({id:this.props.data._id})
  }
  render () {
    const { data } = this.props
    return (
      <tr className="">
        <td><span style={{ fontFamily: 'Arial', fontSize: '12pt' }}>{data.emailId}</span></td>
        <td><p style={{ fontFamily: 'Arial', fontSize: '12pt' }}>{getLocalDate(data.time)}</p></td>
        <td><p  style={{ fontFamily: 'Arial', fontSize: '12pt' }}>{data.totalUploads}</p></td>

        <td>
          <span style={{ fontSize: '13.3333330154419px', background: 'red',color: 'white',
            borderRadius:'5px'}}>
             <Button  onClick={this.onRemoveUser} className=" btn btn-sm" style={{background: 'red',color: 'white',
             borderRadius:'5px'}}>Remove</Button>
          </span>
        </td>
      </tr>
    )
  }
}

TableRowUsers.defaultProps = {
  showActions: true
}

TableRowUsers.propTypes = {
  data: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteDiagUser: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth,
  faculty:state.faculty
})
export default connect(mapStateToProps, {deleteDiagUser})(TableRowUsers)
