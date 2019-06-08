import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Sidebar extends Component {



  render () {

    const { isAuthenticated } = this.props.auth
    let showContent
    if (isAuthenticated) {
      showContent = (
        <nav id="sidebar" className='sidebar-nav-fixed affix' style={{ height: '100%' }}>
          <ul className="list-unstyled components" style={{ height: '100%' }}>
            <li className="active">
            </li>
            <li>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <i className="fas fa-home"/>
                Home
              </Link>
              <Link to="/createAccount" style={{ textDecoration: 'none' }}>
                <i className="fa fa-cog" aria-hidden="true"/>
                Create Account
              </Link><Link to="/changePassword" style={{ textDecoration: 'none' }}>
              <i className="fa fa-wrench" aria-hidden="true"/>
              Change Password
            </Link>
              {/*<Link to="/allQuestions" style={{ textDecoration: 'none' }}>*/}
              {/*  <i className="fas fa-question"/>*/}
              {/*  All Questions*/}
              {/*</Link>*/}
              {/*<Link to="/allProfiles" style={{ textDecoration: 'none' }}>*/}
              {/*  <i className="fas fa-question"/>*/}
              {/*  All Users*/}
              {/*</Link>*/}
              {/*<Link to="/taApplications" style={{ textDecoration: 'none' }}>*/}
              {/*  <i className="fas fa-question"/>*/}
              {/*  TA Applications*/}
              {/*</Link>*/}
            </li>
            <li>
              <Link to="/contactUs" style={{ textDecoration: 'none' }}>
                <i className="fas fa-paper-plane"/>
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>
      )
    }
    return (
      <div style={{ minHeight: '100%' }}>
        {showContent}
      </div>
    )
  }
}

Sidebar.propTypes = {
  auth: PropTypes.object.isRequired,
  home: PropTypes.object.isRequired,

}

const mapStateToProps = state => ({
  auth: state.auth,
  home: state.home,
})

export default connect(mapStateToProps)(Sidebar)
