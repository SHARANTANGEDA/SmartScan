import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { getNameResults } from '../../actions/homeActions'
import FolderItem from '../display/Folders/FolderItem'

class NameSearchResults extends Component {
  constructor () {
    super()
    this.state = {
      currentPage: 1,
      todosPerPage: 25
    };
    this.handleClick = this.handleClick.bind(this);

  }
  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }
  componentDidMount () {
    this.props.getNameResults(this.props.match.params.id)
  }


  render () {
    const {  currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const pageNumbers = [];

    const {resultsName, loading2} = this.props.search
    let allFoldersContent, renderpn;
    if (loading2 || resultsName===null) {
      allFoldersContent = null
    } else {
      if(!resultsName.success || resultsName.name.length===0) {
        window.location.href='/detailsNotFound'
        allFoldersContent = (
          <h3>No record found with name '{this.props.match.params.id}'</h3>
        )
        } else {
          const currentFolder = resultsName.name.slice(indexOfFirstTodo, indexOfLastTodo);
          const render = (  currentFolder.map(folder => (
            <FolderItem folder={folder} key={folder._id}/>
          )))
          for (let i = 1; i <= Math.ceil(resultsName.name.length / todosPerPage); i++) {
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
          renderpn= (
            <nav aria-label="...">
              <ul className="pagination pagination-sm">
                {renderPageNumbers}
              </ul>
            </nav>
          )
        }
      }
    return (
      <div className='nameSearchResults' style={{width: '100%'}}>
        <div style={{width: '100%'}}>
          <h2>Search Results</h2>
          <table className="table table-bordered mb-0">
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
            {allFoldersContent}
          </table>
          <div className='d-flex justify-content-end'>
            {renderpn}
          </div>
        </div>
      </div>

    )
  }
}


NameSearchResults.propTypes = {
  auth: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  getNameResults: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth,
  search: state.search
})
export default connect(mapStateToProps,{getNameResults})(NameSearchResults)
