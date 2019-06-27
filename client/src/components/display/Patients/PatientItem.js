import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import '../allFolders.css'
import { deletePatient } from '../../../actions/homeActions'
import getLocalDate from '../../../utils/getLocalDate'



class PatientItem extends Component {
  constructor () {
    super();
    // this.state = {
    //   file: false
    // };
    this.onOpen = this.onOpen.bind(this);
    // this.onDownload = this.onDownload.bind(this)
  }

  onOpen(e) {
    this.setState({file: true})
  }
  // onDownload(e) {
  //   e.preventDefault()
  //   this.setState({file: true})
  //   this.props.downloadFolder(this.props.folder.id )
  // }
  onDelete(e) {
    e.preventDefault()
    this.props.deletePatient(this.props.patient.mrNo )

  }
  render () {
    const {patient} = this.props;
    // let icon;
    // if(!this.state.file) {
    //   icon= (<button className='btn-sm btn' style={{background: 'green', color: 'white',marginRight: '10px'}}
    //                  onClick={this.onDownload.bind(this)}><i className="fa fa-download" aria-hidden="true"/>
    //   </button>)
    // }else {
    //   icon = (<button className='btn-sm btn' style={{background: 'white',marginRight: '10px'}}><img
    //     src={downloading}
    //     style={{ width: '25px', margin: 'auto', display: 'block' }}
    //     alt="downloading..."
    //   />
    //   </button>)
    // }

    return (
      //onTouchStart="this.classList.toggle('hover');
        <tr>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{patient.centreShortCode}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{patient.centreCode}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{patient.mrNo}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{patient.firstName+' '+patient.lastName}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>{patient.age+'/'+patient.gender}</span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>
            {getLocalDate(patient.lastUploadAt).toString().substring(0,getLocalDate(patient.lastUploadAt).indexOf(','))}
          </span></td>
          <td><span style={{ fontFamily: 'Arial', fontSize: '14px' }}>
            {getLocalDate(patient.lastUploadAt).toString().substring(getLocalDate(patient.lastUploadAt).indexOf(',')+1,
              getLocalDate(patient.lastUploadAt).length)}
          </span></td>

          <td>
            <Link to={`displayFolder/${patient.mrNo}`}  className='btn btn-sm'
                  style={{ borderStyle: 'none', background: 'green', color:'white'}}>View</Link></td>
          <td><button className='btn-sm btn' style={{background: 'red', color: 'white',marginLeft: '10px'}}
              onClick={this.onDelete.bind(this)}><i className="fa fa-trash" aria-hidden="true"/></button></td>
        </tr>

      // <div className="">
      //   <div className="image-flip" >
      //     <div className="mainflip">
      //       <div className="frontside">
      //
      //         <div className="card d-flex justify-content-center" style={{minWidth: '200px', borderStyle: 'solid',
      //         margin:'5px'}}>
      //           <Link to={`displayFolder/${mrNo}`} style={{ borderStyle: 'none', background: 'white'}} ><span>
      //           <div className="card-body ">
      //             <div className='col-md-12  text-center d-flex justify-content-center'>
      //               <img className="img-fluid d-flex justify-content-center" src={require('../folder.png')} alt=''/>
      //             </div>
      //             <div className='row text-center d-flex justify-content-center'>
      //               <h4 className="card-title" style={{fontSize: '18px'}}>{mrNo}</h4>
      //             </div>
      //           </div>
      //           </span>
      //           </Link>
      //           <div className="card-footer d-flex justify-content-around">
      //             <button className='btn-sm btn' style={{background: 'red', color: 'white',marginLeft: '10px'}}
      //                     onClick={this.onDelete.bind(this)}><i className="fa fa-trash" aria-hidden="true"/>
      //             </button>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    )
  }
}

PatientItem.propTypes = {
  patient: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, {deletePatient})(PatientItem);