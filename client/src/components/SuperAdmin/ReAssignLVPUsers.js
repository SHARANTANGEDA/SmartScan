import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import './scroll.css'
import Spinner from '../common/Spinner'
import {  InactiveLVPEIUsers } from '../../actions/sAActions'
import TableRowLVPEI from './tableDisplay/TableRowLVPEI'

class ManageLVPEIUsers extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      todosPerPage: 25
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount () {
    this.props.InactiveLVPEIUsers(this.props.match.params.id)
  }
  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }
  render () {
    let { loading3, lvpUsers} = this.props.view
    const {  currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const pageNumbers = [];
    let content, renderpn

    if (loading3 || lvpUsers===null) {
      return (
        <Spinner/>
      )
    } else {
      const currentFolder = lvpUsers.slice(indexOfFirstTodo, indexOfLastTodo);
      const render = (  currentFolder.map(folder => (
        <TableRowLVPEI data={folder} key={folder._id}/>
      )))
      for (let i = 1; i <= Math.ceil(lvpUsers.length / todosPerPage); i++) {
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
      content=render
      renderpn= (
        <nav aria-label="...">
          <ul className="pagination pagination-sm">
            {renderPageNumbers}
          </ul>
        </nav>
      )
      return (
        <div className='deAssignedLVP' style={{minWidth:'100%'}}>
          <div className='row col-md-12 d-flex justify-content-between'>
            <div className="table-wrapper-scroll-y my-custom-scrollbar col-md-12">
              <h4 className='text-center' style={{
                borderStyle: 'solid', borderWidth: '2px', background: 'green', color: 'white'
                , borderRadius: '2px'
              }}>L V Prasad Users Access Control</h4>
              <table className="table table-bordered table-striped mb-0">
                <thead>
                <tr>
                  <th scope="col" style={{fontSize:'10pt'}}>Username</th>
                  <th scope="col" style={{fontSize:'10pt'}}>Full Name</th>
                  <th scope="col" style={{fontSize:'10pt'}}>Created On Date</th>
                  <th scope="col" style={{fontSize:'10pt'}}>Created at Time</th>
                  <th scope="col" style={{fontSize:'10pt'}}>Edit Details</th>
                  <th scope="col" style={{fontSize:'10pt'}}>Manage</th>
                </tr>
                </thead>
                <tbody>
                {content}
                </tbody>
              </table>
            </div>
          </div>
          <div className='d-flex justify-content-end'>
            {renderpn}
          </div>
        </div>
      )
    }
  }
}

ManageLVPEIUsers.propTypes = {
  auth: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  InactiveLVPEIUsers: PropTypes.func.isRequired

}
const mapStateToProps = state => ({
  auth: state.auth,
  view: state.view
})
export default connect(mapStateToProps,{InactiveLVPEIUsers})(ManageLVPEIUsers)