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
        heading = (<h3>All Uploads of{' '} {folders.mrNo}</h3>)
      }
    }
    return (
      <div className="displayFolder">
        <div className="App-content row d-flex justify-content-center" >
          <div className="grid text-center col-md-12">
            <div className='row '>
              <div style={{margin: '10px'}}>
                <Link to='/dashboard' className='btn' style={{background: 'white', color: 'green'}}>
                  <i className="fa fa-chevron-circle-left fa-3x" aria-hidden="true"/></Link>
              </div>
              <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                color: 'black'
              }}> Welcome to L V Prasad Cloud</h1>

            </div>
            {heading}
          </div>
          <table className="table table-bordered table-striped mb-0">
            <thead>
            <tr>
              <th scope="col">Centre</th>
              <th scope="col">MR No</th>
              <th scope="col">Patient Name</th>
              <th scope="col">Age/Gender</th>
              <th scope="col">Date of upload</th>
              <th scope="col">type</th>
              <th scope="col">Remarks</th>
              <th scope="col">View</th>
              <th scope="col">Download</th>
              <th scope="col">Delete</th>
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