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
          <div className="activeCentres row table-wrapper-scroll-y my-custom-scrollbar "
               style={{minWidth:'100%'}}>
            <h4  className='text-center' style={{
              borderStyle: 'solid', borderWidth: '2px', background: 'green', color: 'white'
              , borderRadius: '2px'
            }}>Active Diagnostic Centres</h4>
            <table className="table table-bordered table-striped mb-0 col-md-12" style={{minWidth:'100%'}}>
              <thead className='col-md-12' style={{minWidth:'100%'}}>
              <tr>
                <th style={{fontSize:'10pt'}}>Centre Name</th>
                <th style={{fontSize:'10pt'}}>Short Code</th>
                <th style={{fontSize:'10pt'}}>User name</th>
                <th style={{fontSize:'10pt'}}>Full Name</th>
                <th style={{fontSize:'10pt'}}>Organization Email</th>
                <th style={{fontSize:'10pt'}}>Creation Date</th>
                <th style={{fontSize:'10pt'}}>Creation Time</th>
                <th style={{fontSize:'10pt'}}>Last Used Date</th>
                <th style={{fontSize:'10pt'}}>Last Used Time</th>
                <th style={{fontSize:'10pt'}}>Centre Users</th>
                <th style={{fontSize:'10pt'}}>No of Uploads</th>
                <th style={{fontSize:'10pt'}}>Re-Commission</th>
              </tr>
              </thead>
              {show}
            </table>
            {show2}
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