import React, { Component } from 'react';
import Spinner from '../../common/Spinner'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {  getHomeFolders } from '../../../actions/homeActions'
import { Link } from 'react-router-dom'
import FolderItem from './FolderItem'


class DisplayFolder extends Component {
  constructor (props) {
    super(props)
    this.state= {
      campusCode: { value: 'all', label: 'Choose Campus' },
      currentPage: 1,
      todosPerPage: 25
    }
    this.codeSelect = this.codeSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }
  componentDidMount () {
    if (this.props.auth.user.role === 'lvpei') {
      this.props.getHomeFolders(this.props.match.params.centre,this.props.match.params.id)
    }
  }
  codeSelect(e) {
    this.setState({campusCode: e})
  }

  render() {
    const {folders, loading, notFound} = this.props.folder
    const {  currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const pageNumbers = [];
    let allFoldersContent, heading, renderpn;
    if (loading || folders===null) {
      allFoldersContent = (<Spinner/>)
    } else {
      if(notFound) {
        allFoldersContent = (
            <h5>Nothing is uploaded yet, please check back later</h5>
        )
        heading=null
      }else {
        // allFoldersContent = (
        heading = (<h5 className='text-center'>{folders.contents[0].firstName+' '+folders.contents[0].lastName}</h5>)

        if(this.state.campusCode.value==='all') {
          const currentFolder = folders.contents.slice(indexOfFirstTodo, indexOfLastTodo);
          const render = (  currentFolder.map(folder => (
            <FolderItem folder={folder} key={folder._id}/>
          )))
          for (let i = 1; i <= Math.ceil(folders.contents.length / todosPerPage); i++) {
            pageNumbers.push(i);
          }
          const renderPageNumbers = (
            pageNumbers.map(number => {
              return (
                <button className='page-item page-link'
                        key={number}
                        id={number}
                        onClick={this.handleClick}
                >
                  {number}
                </button>
              );
            }))
          allFoldersContent=render
          renderpn = (
            <nav aria-label="...">
              <ul className="pagination pagination-sm">
                {renderPageNumbers}
              </ul>
            </nav>

          )

        } else {
          let newFolders = folders.contents.filter(folder => folder.centreCode === this.state.campusCode.value.toString())
          const currentFolder = newFolders.slice(indexOfFirstTodo, indexOfLastTodo);
          const render = (  currentFolder.map(folder => (
            <FolderItem folder={folder} key={folder._id}/>
          )))
          for (let i = 1; i <= Math.ceil(newFolders.length / todosPerPage); i++) {
            pageNumbers.push(i);
          }
          const renderPageNumbers = pageNumbers.map(number => {
            return (
              <button className='page-item page-link'
                      key={number}
                      id={number}
                      onClick={this.handleClick}
              >
                {number}
              </button>
            );
          })
          allFoldersContent=render
          renderpn = (
            <nav aria-label="...">
              <ul className="pagination pagination-sm">
                {renderPageNumbers}
              </ul>
            </nav>

          )
        }
      }
    }
    return (
      <div className="displayFolder">
        <div className="App-content row d-flex justify-content-center" >
          <nav className='navbar navbar-expand-sm justify-content-between col-md-12' style={{ background:'#ffa726', width:'100%', height:'40px'}}>
            {heading}
            {/*<div className='col-md-3'>*/}
            {/*  <Select*/}
            {/*    options={[{ value: 'all', label: 'All' },{ value: 'KAR', label: 'KAR' },*/}
            {/*      { value: 'KVC', label: 'KVC' }, { value: 'GMRV', label: 'GMRV' }, { value: 'MTC', label: 'MTC' }]}*/}
            {/*    className={classnames('isSearchable')}*/}
            {/*    placeholder="Campus Code"*/}
            {/*    name="campusCode" value={this.state.campusCode} onChange={this.codeSelect}>*/}
            {/*  </Select>*/}
            {/*</div>*/}

            <Link to='/dashboard' className='btn' style={{background:'#ffa726', color: 'green'}}>
              BACK</Link>
          </nav>
          <table className="table table-bordered  mb-0">
            <thead>
            <tr>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Centre</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Campus Code</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>MR No</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Patient Name</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Age/Gender</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}} >Date of upload</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}} >Time of upload</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>type</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Remarks</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Incoming Folder</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Selected Folder</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Delete</th>
            </tr>
            </thead>
            <tbody>
            {allFoldersContent}
            </tbody>
          </table>
        </div>
        <div className='d-flex justify-content-end'>
          {renderpn}
        </div>
      </div>
    );
  }
}

DisplayFolder.propTypes = {
  home: PropTypes.object.isRequired,
  getHomeFolders: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
  folder: state.folder
})
export default connect(mapStateToProps, { getHomeFolders })(DisplayFolder);