import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logoutUser } from '../../actions/authActions'
import Select from 'react-select'
import classnames from 'classnames'
import { getSearchResults } from '../../actions/homeActions'

class Navbar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      category: { value: 'mr.No', label: 'MR No' },
      errors: {},
      search: ''
    }
    this.onCatChange = this.onCatChange.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    const newSearch = {
      category: this.state.category.value,
      search: this.state.search,
    }
    console.log({search:newSearch})
    if(this.state.category.value==='mr.No') {
      this.props.getSearchResults(newSearch)
    }else if(this.state.category.value==='name') {
      console.log({name:`/nameSearchResults/${this.state.search}`})
      window.location.href=`/nameSearchResults/${this.state.search}`
    }
  }

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
    console.log({ [e.target.name]: e.target.value })

  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  onCatChange (e) {
    console.log({ category: e })
    this.setState({ category: e })
  }

  onLogoutClick (e) {
    e.preventDefault()
    this.props.logoutUser()
  }

  render () {
    const { isAuthenticated, user } = this.props.auth
    const {results, loading} = this.props.search
    if(loading || results ===null) {

    }else {
      console.log({results:results})
      if(!results.success) {
        window.location.href='/detailsNotFound'
      } else {
        if(results.mrNo!==null) {
          window.location.href=`/displayFolder/${results.mrNo}`
        }
      }
    }
    const { category, errors } = this.state
    const authLinkO = (
      <div className='d-flex justify-content-between align-content-end col-md-12'>
        <div  className="row col-md-6 d-flex justify-content-start align-items-center"
             style={{color:'white', verticalAlign: 'bottom'}}>
          <Link to='/dashboard'> <img style={{ maxWidth: '100px', maxHeight: '100px' }}
                            src={require('../../img/logo2.png')} alt=""/></Link>
         <h2>L V Prasad Eye Institute</h2>

        </div>
        <div className="row d-flex justify-content-end align-items-center" style={{color:'white'}}>
          <img style={{ maxWidth: '200px', maxHeight: '150px' }}
               src={require('../../img/logo.png')} alt=""
          />
          <h2>LVStream</h2>
        </div>
      </div>

    )
    const guestLinkO = (
      <div className='d-flex justify-content-between align-content-end col-md-12'>
        <div className="row col-md-6 d-flex justify-content-start align-items-center"
             style={{color:'white', verticalAlign: 'bottom'}}>
          <Link to='/'> <img style={{ maxWidth: '130px', maxHeight: '130px' }}
                                      src={require('../../img/logo2.png')} alt=""/></Link>
          <h3>L V Prasad Eye Institute</h3>

        </div>
        <div className="row d-flex justify-content-end align-items-center" style={{color:'white'}}>
          <img style={{ maxWidth: '200px', maxHeight: '150px' }}
               src={require('../../img/logo.png')} alt=""
          />
          <h3>LVStream</h3>
        </div>
      </div>
    )

    const authLinksI = (
        <div className=" input-group md-form form-sm form-2 pl-0" style={{ width: '500px', maxWidth: '700px' }}>
          <div style={{ minWidth: '100px' }}>
            <Select options={[{ value: 'mr.No', label: 'MR No' },{value:'name', label: 'Name'}]}
                    className={classnames('isSearchable',
              { 'is-invalid': errors.category })}
                    placeholder="Category"
                    name="category" value={category} onChange={this.onCatChange}>
            </Select>
            {errors.category && (
              <div className="invalid-feedback">{errors.category}</div>
            )}
          </div>
          <input type="text"
                 className={classnames('form-control my-0 py-1 lime-border', { 'is-invalid': errors.search })}
                 placeholder="Search"
                 name="search"
                 value={this.state.search} onChange={this.onChange}/>
          {errors.search && (<div className="invalid-feedback">{errors.search}</div>
          )}
          <div className="input-group-append">
            <button type="submit" onClick={this.onSubmit} className="input-group-text cyan lighten-2">
              <i className="fas fa-search text-grey" aria-hidden="true"/>
            </button>
          </div>
        </div>

    )
    let authLinksIII=null
    if (isAuthenticated && (user.role==='super_admin')) {
      authLinksIII = (
          <ul className="navbar-nav components" style={{ height: '100%' }}>
            <li className='nav-item'>
              <Link className='nav-link' to="/dashboard" style={{color: 'white', borderRadius: '5px' }}>
                <i className="fas fa-home"/>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to="/createUser" style={{color: 'white', borderRadius: '5px' }}>
                <i className="fa fa-cog" aria-hidden="true"/>
                Create LVPEI user
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to="/addDiagnosticCentre" style={{color: 'white', borderRadius: '5px' }}>
                <i className="fa fa-cog" aria-hidden="true"/>
                Add a new Diagnostic centre
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to="/activeCentres" style={{color: 'white', borderRadius: '5px' }}>
                <i className="fa fa-cog" aria-hidden="true"/>
                Active Centres
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to="/removedCentres" style={{color: 'white', borderRadius: '5px' }}>
                <i className="fa fa-cog" aria-hidden="true"/>
                Inactive Centres
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to="/changePassword" style={{color: 'white', borderRadius: '5px' }}>
                <i className="fa fa-wrench" aria-hidden="true"/>
                Change Password
              </Link>
            </li>
          </ul>
      )
    }else if(isAuthenticated && (user.role==='diag_admin')) {
      authLinksIII = (
        <ul className="navbar-nav components" style={{ height: '100%' }}>
          <li className='nav-item'>
            <Link className='nav-link'  to="/dashboard" style={{color: 'white', borderRadius: '5px' }}>
              <i className="fas fa-home"/>
              Home
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link'  to="/createUser" style={{color: 'white', borderRadius: '5px' }}>
              <i className="fa fa-cog" aria-hidden="true"/>
              Create new user
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link'  to="/uploadForm" style={{color: 'white', borderRadius: '5px' }}>
              <i className="fas fa-upload"/>
              Upload Files
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link'  to="/changePassword" style={{color: 'white', borderRadius: '5px' }}>
              <i className="fa fa-wrench" aria-hidden="true"/>
              Change Password
            </Link>
          </li>
        </ul>
      )
    }else if(isAuthenticated && (user.role==='lvpei' || user.role==='diag')) {
      authLinksIII = (
        <ul className="navbar-nav components" style={{ height: '100%' }}>
          <li className='nav-item' >
            <Link className='nav-link' to="/dashboard" style={{color: 'white', borderRadius: '5px' }}>
              <i className="fas fa-home"/>
              Home
            </Link>
          </li>
          <li className='nav-item'  >
            <Link className='nav-link' to="/changePassword" style={{color: 'white', borderRadius: '5px'}}>
              <i className="fa fa-wrench" aria-hidden="true"/>
              Change Password
            </Link>
          </li>
        </ul>
      )
    }
    const authLinksII = (
      <ul className="navbar-nav  ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="" style={{color: 'white', borderRadius: '5px' }}>
            {user.emailId}
          </Link>
        </li>
        <li className="nav-item pull-right">
          <Link className="nav-link" to="/" onClick={this.onLogoutClick.bind(this)}
                style={{color: 'white', borderRadius: '5px' }}>
            <i className="fa fa-power-off" aria-hidden="true"/>
            {'  '}Logout</Link>
        </li>
      </ul>
    )

    return (
      <nav className="navbar navbar-expand-sm  col-md-12" style={{background:'#008cff'}}>
        <div className="row container d-flex justify-content-between col-md-12">
          <div className='row col-md-12 d-flex justify-content-between col-md-12' >
            {isAuthenticated ? authLinkO : guestLinkO}
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="row collapse navbar-collapse justify-content-between" id="mobile-nav">
            <div>
              {isAuthenticated ? authLinksIII: null}
            </div><div>
              {(isAuthenticated && user.role==='lvpei') ? authLinksI : null}
            </div> <div>
            {isAuthenticated ? authLinksII : null}
          </div>
          </div>
          </div>
        </div>
      </nav>
    )
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  search: state.search
})

export default connect(mapStateToProps, { logoutUser, getSearchResults })(Navbar)
