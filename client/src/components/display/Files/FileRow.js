import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import FileItem from './FileItem'

class FileRow extends Component {
  render () {
    const {files} = this.props;
    let showUsers = ( files.map(file => (
      <FileItem file={file} key={file.filename}/>
    )));
    return (
      // style={{height: "20%", width: "100%",minWidth: "100%"}}   d-flex flex-grow-1
      <div className="row" >
        {showUsers}
      </div>
    )
  }
}

FileRow.defaultProps = {
  showActions: true
}
FileRow.propTypes = {
  files: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(FileRow);