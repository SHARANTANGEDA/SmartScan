import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import TextFieldGroup from '../common/TextFieldGroup'
import { loginUser } from '../../actions/authActions'

class Landing extends Component {
  constructor () {
    super();
    this.state = {
      emailId: '',
      password: '',
      errors: {}
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  changeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount () {
    if(this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if(nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    if(nextProps) {
      this.setState({errors: nextProps.errors})
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const userData = {
      emailId: this.state.emailId,
      password: this.state.password
    };
    this.props.loginUser(userData);
  }
  render() {
    const {errors} = this.state;

    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">LVPEI Media Cloud</h1>
                <p className="lead" style={{color: 'white'}}>
                  {' '}
                  Sign in to access account
                </p>
                <hr />
              </div>
              <div className="col-md-6 text-center">

                <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup placeholder="Email Address" error={errors.emailId}
                                  type="text" onChange={this.changeHandler} value={this.state.emailId} name="emailId"
                  />
                  <TextFieldGroup placeholder="Password" error={errors.password}
                                  type="password" onChange={this.changeHandler} value={this.state.password} name="password"
                  />
                  <div className="col-md-12 d-flex justify-content-center text-center">
                    <input style={{maxWidth:'250px'}} type="submit" value='Login' className="btn btn-info btn-block mt-4"/>
                  </div>
                  </form>
                <p style={{color: 'white'}}>Forgot Password,
                  <Link  to={"/ContactUs"} className={"text-primary"}> Click Here </Link> to contact Admins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
  loginUser:PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors

});

export default connect(mapStateToProps,{loginUser})(Landing);
