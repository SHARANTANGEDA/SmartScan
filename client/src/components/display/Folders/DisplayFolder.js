import React, { Component } from 'react';
import Spinner from '../../common/Spinner'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {  getHomeFolders } from '../../../actions/homeActions'
import { Link } from 'react-router-dom'
import FolderRow from './FolderRow'


class DisplayFolder extends Component {

  componentDidMount () {
    if (this.props.auth.user.role === 'lvpei') {
      this.props.getHomeFolders(this.props.match.params.id)
    }
  }


  render() {
    const {folders, loading, notFound} = this.props.folder
    let allFoldersContent, heading;
    if (loading || folders===null) {
      allFoldersContent = <Spinner/>
    } else {
      if(notFound) {
        allFoldersContent = (
          <div>
            <p>Nothing is uploaded yet, please check back later</p>
          </div>
        )
        heading=null
      }else {
        allFoldersContent = (
          <FolderRow folders={folders.contents}/>
        )
        heading = (<h3 className='text-center'>{folders.contents[0].firstName+' '+folders.contents[0].lastName}</h3>)
      }
    }
    return (
      <div className="displayFolder">
        <div className="App-content row d-flex justify-content-center" >
          <nav className='navbar navbar-expand-sm justify-content-between col-md-12' style={{background:'white', width:'100%'}}>
            {heading}
            <Link to='/dashboard' className='btn' style={{background: 'white', color: 'green'}}>
              <i className="fa fa-chevron-circle-left fa-3x" aria-hidden="true"/></Link>
          </nav>
          <table className="table table-bordered table-striped mb-0">
            <thead>
            <tr>
              <th scope="col" style={{ fontSize: '10pt'}}>Centre</th>
              <th scope="col" style={{ fontSize: '10pt'}}>MR No</th>
              <th scope="col" style={{ fontSize: '10pt'}}>Patient Name</th>
              <th scope="col" style={{ fontSize: '10pt'}}>Age/Gender</th>
              <th scope="col" style={{ fontSize: '10pt'}} >Date of upload</th>
              <th scope="col" style={{ fontSize: '10pt'}}>type</th>
              <th scope="col" style={{ fontSize: '10pt'}}>Remarks</th>
              <th scope="col" style={{ fontSize: '10pt'}}>View</th>
              <th scope="col" style={{ fontSize: '10pt'}}>Download</th>
              <th scope="col" style={{ fontSize: '10pt'}}>Delete</th>
            </tr>
            </thead>
            <tbody>
            {allFoldersContent}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

DisplayFolder.propTypes = {
  home: PropTypes.object.isRequired,
  getHomeFolders: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
  folder: state.folder
})
export default connect(mapStateToProps, { getHomeFolders })(DisplayFolder);