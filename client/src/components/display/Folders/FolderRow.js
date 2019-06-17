import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import FolderItem from './FolderItem'

class FolderRow extends Component {
  render () {
    const {folders} = this.props;
    let showUsers = ( folders.map(folder => (
      <FolderItem folder={folder} key={folder._id}/>
    )));
    return (
      <div className="row" >
        {showUsers}
      </div>
    )
  }
};

FolderRow.defaultProps = {
  showActions: true
}
FolderRow.propTypes = {
  folders: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(FolderRow);