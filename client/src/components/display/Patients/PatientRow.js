import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import PatientItem from './PatientItem'

class PatientRow extends Component {
  render () {
    const {folders} = this.props;
    let showUsers = ( folders.map(folder => (
      <PatientItem mrNo={folder} key={folder}/>
    )));
    return (
      <div className="row" >
        {showUsers}
      </div>
    )
  }
};

PatientRow.defaultProps = {
  showActions: true
}
PatientRow.propTypes = {
  folders: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PatientRow);
