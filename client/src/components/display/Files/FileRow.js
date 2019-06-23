import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import FileItem from './FileItem'

class FileRow extends Component {
  render () {
    const {files, patient} = this.props;
    let showUsers = ( files.map(file => (
      <FileItem file={file} patient={patient} key={file.filename} check={this.props.check}/>
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
  patient: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  check: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(FileRow);
