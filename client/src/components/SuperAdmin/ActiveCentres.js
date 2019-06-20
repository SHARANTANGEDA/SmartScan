import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import './scroll.css'
import ShowTable from '../SuperAdmin/tableDisplay/ShowTable'
import Spinner from '../common/Spinner'
import { activeCentres } from '../../actions/sAActions'

class ActiveCentres extends Component {
  componentDidMount () {
    this.props.activeCentres(this.props.match.params.id)
  }

  render () {

    const {loading, active} = this.props.view
    if (loading || active===null) {
      return (
        <Spinner/>
      )
    } else {
      let show, show2
      if(active.length===0) {
        show=null
        show2=(<h3 className='row text-center'>There are no Active Centres currently</h3>)
      }else {
        show= (<tbody>
        <ShowTable data={active} index={{ type: 'viewActivity' }}/>
        </tbody>)
        show2=null
      }
      return (
        <div className='activeCentres row'>
          <div className="table-wrapper-scroll-y my-custom-scrollbar col-md-12">
            <h3 className='text-center' style={{
              borderStyle: 'solid', borderWidth: '2px', background: 'green', color: 'white'
              , borderRadius: '2px', fontFamily: 'lobster'
            }}>Active Diagnostic Centres</h3>
            <table className="table table-bordered table-striped mb-0">
              <thead>
              <tr>
                <th scope="col">Centre Name</th>
                <th scope="col">User name</th>
                <th scope="col">Organization Email</th>
                <th scope="col">Created On On</th>
                <th scope="col">Last Updated On</th>
                <th scope='col'>Accounts Created</th>
                <th scope="col">Decommission</th>
              </tr>
              </thead>
              {show}
            </table>
            {show2}
          </div>
        </div>
      )
    }
  }
}

ActiveCentres.propTypes = {
  auth: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  activeCentres: PropTypes.func.isRequired,

}
const mapStateToProps = state => ({
  auth: state.auth,
  view: state.view
})
export default connect(mapStateToProps, {activeCentres})(ActiveCentres)