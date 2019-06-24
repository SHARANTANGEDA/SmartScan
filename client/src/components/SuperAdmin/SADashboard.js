import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import './scroll.css'
import ShowTable from '../SuperAdmin/tableDisplay/ShowTable'
import Card from 'react-bootstrap/Card'
import Spinner from '../common/Spinner'

class SADashboard extends Component {
  render () {
    let { lvpei, diag_admin, centre, diagLen , patientsLen} = this.props.home
    if (this.props.home.lvpei === null || this.props.home.centre === null ||
      this.props.home.diag_admin === null || this.props.home.diagLen === null) {
      return (
        <Spinner/>
      )
    } else {
      return (
        <div className='row d-flex justify-content-between' style={{width:'100% '}}>
          <div className='row col-md-12 d-flex justify-content-between' style={{margin: '5px'}}>
              <Card style={{
                backgroundColor: '#00acc1', maxHeight: '150px', maxWidth: '200px', marginRight: '20px',
              }}>
                <div color="warning" className='text-center'>
                  <p className='' style={{ color: 'white' }}>Number of LVPEI Accounts</p>
                  <h1 className='' style={{ color: 'white', fontWeight: 'bold' }}>
                    {lvpei.length}
                  </h1>
                </div>
              </Card>
              <Card style={{
                backgroundColor: '#f44336', maxHeight: '150px', maxWidth: '200px', marginRight: '20px',
              }}>
                <div color="warning" className='text-center'>
                  <p className='' style={{ color: 'white' }}>Number of Diagnostic centers</p>
                  <h1 className='' style={{ color: 'white', fontWeight: 'bold' }}>
                    {diag_admin.length}
                  </h1>
                </div>
              </Card>
              <Card style={{
                backgroundColor: '#4caf50', maxHeight: '150px', maxWidth: '200px', marginRight: '20px',
              }}>
                <div color="warning" className='text-center'>
                  <p className='' style={{ color: 'white' }}>Total Number of Center Accounts</p>
                  <h1 className='' style={{ color: 'white', fontWeight: 'bold' }}>
                    {diagLen}
                  </h1>
                </div>
              </Card>
              <Card style={{
                backgroundColor: '#ffa726', maxHeight: '150px', maxWidth: '200px', marginRight: '20px',
              }}>
                <div color="warning" className='text-center'>
                  <p className='' style={{ color: 'white' }}>Patient Details On Cloud</p>
                  <h1 className='' style={{ color: 'white', fontWeight: 'bold' }}>
                    {patientsLen}
                  </h1>
                </div>
              </Card>
            </div>
          <div className='row col-md-12 d-flex justify-content-between'>
            <div className="table-wrapper-scroll-y my-custom-scrollbar col-md-6">
              <h4 className='text-center' style={{
                borderStyle: 'solid', borderWidth: '2px', background: 'green', color: 'white'
                , borderRadius: '2px'
              }}>L V Prasad Users Access Control</h4>
              <table className="table table-bordered table-striped mb-0">
                <thead>
                <tr>
                  <th scope="col">Username</th>
                  <th scope="col">Created On</th>
                  <th scope="col">Manage</th>
                </tr>
                </thead>
                <tbody>
                <ShowTable data={lvpei} index={{ type: 'lvpei' }}/>
                </tbody>
              </table>
            </div>

            <div className="table-wrapper-scroll-y my-custom-scrollbar col-md-6">
              <h4 className='text-center' style={{
                borderStyle: 'solid', borderWidth: '2px', background: 'green', color: 'white'
                , borderRadius: '2px'
              }}>Diagnostic Centre Access Control</h4>
              <table className="table table-bordered table-striped mb-0">
                <thead>
                <tr>
                  <th scope="col">Centre Name</th>
                  <th scope="col">User name</th>
                  <th scope="col">Control Access</th>
                </tr>
                </thead>
                <tbody>
                <ShowTable data={centre} index={{ type: 'centre' }}/>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
  }
}

SADashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  home: PropTypes.object.isRequired

}
const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(mapStateToProps)(SADashboard)