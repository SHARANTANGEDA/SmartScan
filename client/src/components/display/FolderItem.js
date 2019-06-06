import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import './allFolders.css'


class FolderItem extends Component {
  constructor () {
    super();
    this.state = {
      file: false
    };
    this.onOpen = this.onOpen.bind(this);
  }

  onOpen(e) {
    this.setState({file: true})
  }
  render () {
    const {folder} = this.props;
    console.log({folder:folder})

    return (
      //onTouchStart="this.classList.toggle('hover');
      <div className="">
        <div className="image-flip" >
          <div className="mainflip">
            <div className="frontside">
              <Link to={`displayFolder/${folder.id}`} style={{ borderStyle: 'none', background: 'white'}} ><span>
              <div className="card" style={{minWidth: '200', borderStyle: 'none'}}>
                <div className="card-body text-center">
                  <p><img className="img-fluid" src={require('./folder.png')} alt=''/></p>
                  <div className='row d-flex justify-content-between'>
                    <h4 className="card-title" style={{fontSize: '18px'}}>{folder.name}</h4>
                  </div>
                </div>
              </div>
              </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FolderItem.propTypes = {
  folder: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(FolderItem);