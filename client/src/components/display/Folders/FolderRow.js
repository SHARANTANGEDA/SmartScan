import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import FolderItem from './FolderItem'
import PatientItem from '../Patients/PatientItem'

class FolderRow extends Component {
  constructor() {
    super();
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
  render () {
    const {  currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const pageNumbers = [];
    const {folders, code} = this.props;


    if(code==='all') {
      const currentFolder = folders.slice(indexOfFirstTodo, indexOfLastTodo);
      const render = (  currentFolder.map(folder => (
        <FolderItem folder={folder} key={folder._id}/>
      )))
      for (let i = 1; i <= Math.ceil(folders.length / todosPerPage); i++) {
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
      return (
        <tbody>
        {render}
        <nav aria-label="...">
          <ul className="pagination pagination-sm">
            {renderPageNumbers}
          </ul>
        </nav>
        </tbody>
      )
    } else {
      let newFolders = folders.filter(folder => folder.centreCode === code.toString())
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
      return (
        <tbody>
        {render}
        <nav aria-label="...">
          <ul className="pagination pagination-sm">
            {renderPageNumbers}
          </ul>
        </nav>
        </tbody>
      )
    }

  }
}

FolderRow.defaultProps = {
  showActions: true
}
FolderRow.propTypes = {
  folders: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  code: PropTypes.string.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(FolderRow);
