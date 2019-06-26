import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { deleteLVPEIUser, grantUserAccess, removeUserAccess } from '../../../actions/sAActions'
import getLocalDate from '../../../utils/getLocalDate'
import downloading from '../../common/downloading.gif'
import { grantDiagUserAccess, removeDiagUserAccess } from '../../../actions/dAActions'

class TableRowDiagUser extends Component {
  constructor () {
    super()
    this.state= {
      removeClick: false,
      grantClick: false
    }
    this.onRemoveAccess = this.onRemoveAccess.bind(this)
    this.onGrantAccess = this.onGrantAccess.bind(this)

  }

  onRemoveAccess(e) {
    console.log(this.props.data.emailId)
    this.props.removeDiagUserAccess({emailId: this.props.data.emailId})
    this.setState({removeClick: true})
  }

  onGrantAccess(e) {
    this.props.grantDiagUserAccess({emailId: this.props.data.emailId})
    this.setState({grantClick: true})
  }

  render () {
    const { data } = this.props
    let content
    // if (this.props.data.access) {
    //   content = (
    //     <span style={{ fontSize: '13.3333330154419px', background: 'red', color: 'white', borderRadius: '5px' }}>
    //       <button onClick={this.onDelete} className=" btn btn-sm"
    //               style={{ background: 'red', color: 'white', borderRadius: '5px' }}>Remove</button>
    //     </span>
    //   )
    // }else {
    //
    // }
    if(this.props.data.access) {
      if(!this.state.removeClick) {
        content = (
          <span style={{ fontSize: '13.3333330154419px', background: 'red',color: 'white', borderRadius: '5px'}}>
          <button onClick={this.onRemoveAccess} className=" btn btn-sm" style={{background: 'red',color: 'white', borderRadius: '5px'}}>Remove Access
          </button>
        </span>
        )
      }else {
        content = (
          <span style={{ fontSize: '13.3333330154419px',color: 'white', borderRadius: '5px'}}>
            <img
              src={downloading}
              style={{ width: '25px', margin: 'auto', display: 'block' }}
              alt="processing..."
            />
        </span>
        )
      }

    }else {
      if(!this.state.grantClick) {
        content = (
          <span style={{ fontSize: '13.3333330154419px', background: 'green',color: 'white', borderRadius: '5px'}}>
          <button onClick={this.onGrantAccess} className=" btn btn-success" style={{background: 'green', borderRadius: '5px'}}>Grant Access</button>
        </span>
        )
      }else {
        content=(<span style={{ fontSize: '13.3333330154419px',color: 'white'}}>
          <img
            src={downloading}
            style={{ width: '25px', margin: 'auto', display: 'block' }}
            alt="processing..."
          />
        </span>
        )
      }

    }
    // else {
    //   content = (
    //     <span style={{ fontSize: '13.3333330154419px', background: 'green', color: 'white' }}>
    //       <button className=" btn btn-success" style={{ background: 'green', color: 'white', borderRadius: '5px' }}>
    //         Give Access</button>
    //     </span>
    //   )
    // }
    return (
      <tr className="">
        <td><span style={{ fontFamily: 'Arial', fontSize: '12px' }}>{data.emailId}</span></td>
        <td>
          <span style={{ fontFamily: 'Arial', fontSize: '12px' }}>{data.firstName + ' ' + data.lastName}</span>
        </td>
        <td>
          <span  style={{ fontFamily: 'Arial', fontSize: '12px' }}>
            {getLocalDate(data.time).substring(0,getLocalDate(data.time).indexOf(','))}</span>
        </td>
        <td>
          <span  style={{ fontFamily: 'Arial', fontSize: '12px' }}>
            {getLocalDate(data.time).substring(getLocalDate(data.time).indexOf(',')+1,getLocalDate(data.time).length)}
          </span>
        </td>
        <td>
          <span style={{ fontSize: '13.3333330154419px', background: 'green',color: 'white', borderRadius: '5px'}}>
          <button onClick={this.onGrantAccess} className=" btn btn-success" style={{background: 'blue', borderRadius: '5px'}}>Edit</button>
        </span>
        </td>
        <td>
          {content}
        </td>
      </tr>
    )
  }
}

TableRowDiagUser.defaultProps = {
  showActions: true
}

TableRowDiagUser.propTypes = {
  data: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  removeDiagUserAccess: PropTypes.func.isRequired,
  grantDiagUserAccess: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth,
  faculty: state.faculty
})
export default connect(mapStateToProps, { removeDiagUserAccess, grantDiagUserAccess})(TableRowDiagUser)
