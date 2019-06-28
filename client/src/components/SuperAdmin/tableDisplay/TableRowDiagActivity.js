import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import downloading from '../../common/downloading.gif'
import { grantDiagAccess, removeDiagAccess } from '../../../actions/sAActions'
import getLocalDate from '../../../utils/getLocalDate'

class TableRowDiagActivity extends Component {
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

    this.props.removeDiagAccess({emailId: this.props.data.adminId})
    this.setState({removeClick: true})
  }

  onGrantAccess(e) {
    this.props.grantDiagAccess({emailId: this.props.data.adminId})
    this.setState({grantClick: true})
  }
  render () {
    const { data } = this.props
    let content
    if(this.props.data.access) {
      if(!this.state.removeClick) {
        content = (
          <span style={{ fontSize: '13.3333330154419px', background: 'red',color: 'white', borderRadius: '5px'}}>
          <button onClick={this.onRemoveAccess} className=" btn btn-sm"
                  style={{background: 'red',color: 'white', borderRadius: '5px'}}>Remove Access
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
          <span style={{ fontSize: '13.3333330154419px', background: 'green',color: 'white', borderRadius: '5px'
            ,whiteSpace: 'nowrap'}}>
          <button onClick={this.onGrantAccess} className=" btn btn-success"
                  style={{background: 'green', borderRadius: '5px'}}>Grant Access</button>
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
    return (
      <tr className="">
        <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{data.centreName}</span></td>
        <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{data.short}</span></td>

        <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{data.adminId}</span></td>
        <td><span style={{ fontFamily: 'Arial', fontSize: '14px',whiteSpace: 'nowrap' }}>
          {data.firstName+ ' '+data.lastName}</span></td>

        <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{data.orgEmail}</span></td>
        <td>
          <span style={{ fontFamily: 'Arial', fontSize: '14px',whiteSpace: 'nowrap' }}>
            {getLocalDate(data.createdAt).substring(0,getLocalDate(data.createdAt).indexOf(','))}</span>
        </td>
        <td>
          <span style={{ fontFamily: 'Arial', fontSize: '14px',whiteSpace: 'nowrap' }}>
            {getLocalDate(data.createdAt).substring(getLocalDate(data.createdAt).indexOf(',')+1,
              getLocalDate(data.createdAt).length)}</span>
        </td>
        <td>
          <span style={{ fontFamily: 'Arial', fontSize: '14px',whiteSpace: 'nowrap' }}>
            {getLocalDate(data.lastUpdate).substring(0,getLocalDate(data.lastUpdate).indexOf(','))}</span>
        </td>
        <td>
          <span style={{ fontFamily: 'Arial', fontSize: '14px',whiteSpace: 'nowrap' }}>
            {getLocalDate(data.lastUpdate).substring(getLocalDate(data.lastUpdate).indexOf(',')+1,
              getLocalDate(data.lastUpdate).length)}</span>
        </td>
        <td>
          <span className='text-center' style={{ fontFamily: 'Arial', fontSize: '14px' }}>{data.members.length}</span>
        </td>
        <td>
          <span className='text-center' style={{ fontFamily: 'Arial', fontSize: '14px' }}>{data.totalUploads}</span>
        </td>
        <td>
          {content}
        </td>
      </tr>
    )
  }
}

TableRowDiagActivity.defaultProps = {
  showActions: true
}

TableRowDiagActivity.propTypes = {
  data: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  removeDiagAccess: PropTypes.func.isRequired,
  grantDiagAccess: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth,
  faculty:state.faculty
})
export default connect(mapStateToProps,{removeDiagAccess, grantDiagAccess})(TableRowDiagActivity)
