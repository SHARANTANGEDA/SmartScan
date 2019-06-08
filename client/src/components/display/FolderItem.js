import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import './allFolders.css'
import { deleteFolder, downloadFolder } from '../../actions/homeActions'
import TextFieldGroup from '../common/TextFieldGroup'



class FolderItem extends Component {
  constructor () {
    super();
    this.state = {
      file: false
    };
    this.onOpen = this.onOpen.bind(this);
    this.onDownload = this.onDownload.bind(this)
  }

  onOpen(e) {
    this.setState({file: true})
  }
  onDownload(e) {
    e.preventDefault()
    this.props.downloadFolder(this.props.folder.id )
  }
  onDelete(e) {
    e.preventDefault()
    this.props.deleteFolder(this.props.folder.id )

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
              <div className="card" style={{minWidth: '200px', borderStyle: 'solid'}}>
                <div className="card-body text-center">
                  <p><img className="img-fluid" src={require('./folder.png')} alt=''/></p>
                  <div className='row text-center d-flex justify-content-center'>
                    <h4 className="card-title" style={{fontSize: '18px'}}>{folder.name}</h4>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-around">
                  <button className='btn-sm btn' style={{background: 'green', color: 'white',marginRight: '10px'}}
                          onClick={this.onDownload.bind(this)}><i className="fa fa-download" aria-hidden="true"/>
                  </button>
                  <button className='btn-sm btn' style={{background: 'red', color: 'white',marginLeft: '10px'}}
                          onClick={this.onDelete.bind(this)}><i className="fa fa-trash" aria-hidden="true"/>
                  </button>

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
export default connect(mapStateToProps, {downloadFolder, deleteFolder})(FolderItem);