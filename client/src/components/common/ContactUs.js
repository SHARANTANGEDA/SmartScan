import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'

class ContactUs extends Component {

  render () {
    return (
      <div className="container-fluid contactUs">
        <div className="row">
          <div className="col-md-12">
            <div className="container-fluid ">
              <div className="row">
                <div className="col-md-12 bg-light">
                  <h1 className="text-capitalize pt-1 text-center bg-light text-dark">Our team</h1>
                </div>
              </div>
              <div>
                <h1>Coming up shortly please bear with us</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
// {/*<div className="row w-25 bg-dark">*/}
// {/*  <div className="col-6 col-lg-12 p-4 bg-dark">*/}
// {/*    <img className="img-fluid d-block mb-3 mx-auto rounded-circle"*/}
// {/*         src={require("../../img/us/dheeraj.jpeg")} alt="" width="100" />*/}
// {/*    <h4 className="text-light"><b>Sai Dheeraj Gajulapalli</b></h4>*/}
// {/*    <p className="mb-3 text-white">f20171701@hyderabad.bits-pilani.ac.in</p>*/}
// {/*  </div>*/}
// {/*</div>*/}
//
// {/*<div className="col-6 col-lg-3 p-4 bg-dark">*/}
// {/*  <img className="img-fluid d-block mb-3 mx-auto rounded-circle"*/}
// {/*       src={require("../../img/us/baswath.jpg")} alt="" width="100" />*/}
// {/*    <h4 className="text-light"><b>Narkedamilly Bhaswath</b></h4>*/}
// {/*    <p className="mb-3 text-white">f20170033@hyderabad.bits-pilani.ac.in</p>*/}
// {/*</div>*/}
// {/*<div className="col-6 col-lg-3 p-4 bg-dark">*/}
// {/*  <img className="img-fluid d-block mb-3 mx-auto rounded-circle"*/}
// {/*       src={require("../../img/us/rohan.jpg")} alt="" width="100" />*/}
// {/*    <h4 className="text-light"><b>Rohan Kumar B N</b></h4>*/}
// {/*    <p className="mb-3 text-white">f20170024@hyderabad.bits-pilani.ac.in</p>*/}
// {/*</div>*/}
ContactUs.defaultProps = {
  showActions: true
}

ContactUs.propTypes = {
  auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth,
})
export default connect(mapStateToProps)(ContactUs)
