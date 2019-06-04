import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import './allUsers.css'

class FolderItem extends Component {
  render () {
    const {user} = this.props;
    const name = user.firstName+' '+user.lastName;
    console.log({reputation:user})
    // return (
    //   <div className="col-md-4" style={{margin: '10px'}}>
    //     <img className="rounded-circle" src={user.avatar} alt='http://pinegrow.com/placeholders/img19.jpg' style={{height: "20%", width: "35%"}}/>
    //     <h3><Link to={`/publicProfile/${user._id}`}>{name}</Link></h3>
    //     <p>{user.emailId}</p>
    //     <p>{user.departmentName}</p>
    //   </div>
    // )
    return (
      //onTouchStart="this.classList.toggle('hover');
      <div className="col-xs-12 col-sm-6 col-md-4">
        <div className="image-flip" >
          <div className="mainflip">
            <div className="frontside">
              <Link to={`/publicProfile/${user._id}`} style={{color: 'white'}}>
              <div className="card" >
                <div className="card-body text-center">
                  <p><img className="img-fluid" src='../../img/folder.png' alt=''/></p>
                  <div className='row d-flex justify-content-between'>
                    <h4 className="card-title" style={{fontSize: '18px'}}>{name}</h4>
                  </div>
                </div>
              </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FolderItem.propTypes = {
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(FolderItem);