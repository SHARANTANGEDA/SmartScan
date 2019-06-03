import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getDetails } from '../../actions/homeActions'

class UploadFolder extends Component {


  constructor () {
    super();
    this.state = {
      dicoms: [],
      errors: {}
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  changeHandler(e) {
    console.log(e.target.files)
    this.setState({ [e.target.name]: e.target.files });

  }
  componentWillReceiveProps (nextProps, nextContext) {
    if(nextProps) {
      this.setState({errors: nextProps.errors})
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const userData = {
      dicoms: this.state.dicoms
    };
    console.log(userData)
    // this.props.getDetails(userData);
  }
  render () {
    const {errors} = this.state;
      return (
        <div className='uploadFiles' style={{ width: '100%' }}>
          <div id="content" className="snippet-hidden ">
            <div className="inner-content">
              <div id="mainbar" className='row d-flex justify-content-center'>
                <div className="grid text-center col-md-12">
                  <h1 className="grid--cell fl1 fs-headline1 text-center" style={{
                    fontFamily: 'Lobster',
                    color: 'black', fontSize: '48px'
                  }}> Welcome L V Prasad MRI Docs Cloud</h1>
                </div>

                <div className="col-md-6 text-center" style={{width: '100%'}}>
                  <p style={{ color: 'white', background: 'green' }} className='btn w-100'>
                    Enter the Details below to upload the images</p>
                  <form noValidate onSubmit={this.onSubmit}>
                    <input id="file" type="file" onChange={this.changeHandler} required multiple name='dicoms'/>

                    <input type="submit" className="btn btn-info btn-block mt-4"/>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
}

UploadFolder.propTypes = {
  home: PropTypes.object.isRequired,
  getDetails: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
})
export default connect(mapStateToProps, {  getDetails })(UploadFolder)
