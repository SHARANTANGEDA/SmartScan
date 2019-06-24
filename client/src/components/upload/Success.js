import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UploadSuccess from '../common/UploadSuccess'
import { Link } from 'react-router-dom'

class Success extends Component {
  render () {
      return (
        <div className='uploadSuccess' style={{ width: '100%' }}>
          <div id="content" className="snippet-hidden">
            <div className="inner-content">
              <div id="mainbar" className='row d-flex justify-content-center'>
                <div className="grid text-center col-md-12">
                  {/*<h1 className="grid--cell fl1 fs-headline1 text-center" style={{*/}
                  {/*  color: 'black'*/}
                  {/*}}> Welcome to L V Prasad MRI Docs Cloud</h1>*/}
                </div>
                <div className="col-md-6 text-center" style={{width: '100%'}}>
                  <UploadSuccess/>
                  <p style={{ color: 'white', background: 'green' }} className='btn w-100'>
                    Done!!, Your files are safely stored in Our Cloud</p>
                  <Link to='/dashboard' className='btn btn-primary'>Return to Dashboard</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
  }
}

Success.propTypes = {
  home: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
})
export default connect(mapStateToProps)(Success)
