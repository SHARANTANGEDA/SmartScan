import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import FolderItem from './FolderItem'

class FolderRow extends Component {
  render () {
    const {folders} = this.props;
    let showUsers = ( folders.map(user => (
      <FolderItem user={user} key={user._id}/>
    )));
    return (
      // style={{height: "20%", width: "100%",minWidth: "100%"}}   d-flex flex-grow-1
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
