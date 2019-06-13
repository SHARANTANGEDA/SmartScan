import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import OnDownload from '../common/OnDownload'

class DownloadFolder extends Component {
  render () {
    return (
      <div className='downloading' style={{ width: '100%' }}>
        <div id="content" className="snippet-hidden">
          <div className="inner-content">
            <div id="mainbar" className='row d-flex justify-content-center'>
              <div className="grid text-center col-md-12">
                <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                  fontFamily: 'Lobster',
                  color: 'black', fontSize: '48px'
                }}>L V Prasad MRI Docs Cloud</h1>
              </div>
              <div className="col-md-6 text-center" style={{width: '100%'}}>
                <OnDownload/>
                <p style={{ color: 'white', background: 'green' }} className='btn w-100'>
                  Your Data is being compressed for reduced download size!!
                  ...Please wait for download to finish</p>
                <Link to='/dashboard' className='btn btn-primary'>Return to Dashboard</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

DownloadFolder.propTypes = {
  home: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth
})
export default connect(mapStateToProps)(DownloadFolder)
