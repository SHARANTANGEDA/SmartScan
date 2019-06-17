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
    console.log(newSearch)
    this.props.getSearchResults(newSearch)
  }

  onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
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
      if(!results.success) {
        window.location.href='/detailsNotFound'
      } else {
        window.location.href=`/displayFolder/${results.mrNo}`
      }
    }
    const { category, errors } = this.state
    const authLinkO = (
      <Link className="navbar-brand" to="/dashboard" style={{ fontFamily: '\'Lobster\', cursive', fontSize: '26px' }}>
        <img style={{ maxWidth: '20%', maxHeight: '25%' }}
             src={require('../../img/logoIcon.png')} alt=""
             title=""/>MRIStream
      </Link>

    )
    const guestLinkO = (
      <Link className="navbar-brand" to="/" style={{ fontFamily: '\'Lobster\', cursive', fontSize: '26px' }}>
        <img style={{ maxWidth: '20%', maxHeight: '25%' }}
             src={require('../../img/logoIcon.png')} alt=""
             title=""/>MRIStream
      </Link>
    )

    const authLinksI = (
        <div className="input-group md-form form-sm form-2 pl-0" style={{ width: '500px', maxWidth: '700px' }}>
          <div style={{ minWidth: '100px' }}>
            <Select options={[{ value: 'mr.No', label: 'MR No' }]} className={classnames('isSearchable',
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
    const authLinksII = (
      <ul className="navbar-nav ml-auto" style={{ minWidth: '300px' }}>
        <li className="nav-item">
          <Link className="nav-link" to="" style={{ minWidth: '150px', color: 'white' }}>
            {user.emailId}
          </Link>
        </li>
        <li className="nav-item pull-right">
          <Link className="nav-link" to="/" onClick={this.onLogoutClick.bind(this)} style={{ color: 'white' }}>
            <i className="fa fa-power-off" aria-hidden="true"/>
            {'  '}Logout</Link>
        </li>
      </ul>
    )

    return (
      <nav className="navbar navbar-expand-sm navbar-dark">
        <div className="container">
          {isAuthenticated ? authLinkO : guestLinkO}
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="collapse navbar-collapse" id="mobile-nav">
            {(isAuthenticated && user.role==='lvpei') ? authLinksI : null}
            {isAuthenticated ? authLinksII : null}
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
