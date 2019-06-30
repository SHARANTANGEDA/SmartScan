import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import './scroll.css'
import Spinner from '../common/Spinner'
import { ControlDiagUsers } from '../../actions/dAActions'
import TableRowLVPEI from '../SuperAdmin/tableDisplay/TableRowLVPEI'

class ManageDiagUsers extends Component {
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
  componentDidMount () {
    this.props.ControlDiagUsers(this.props.match.params.id)
  }

  render () {
    let { loading3, lvpUsers} = this.props.view
    const {  currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const pageNumbers = [];
    let show, renderpn=null
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
      show=render
      renderpn= (
        <nav aria-label="...">
          <ul className="pagination pagination-sm">
            {renderPageNumbers}
          </ul>
        </nav>
      )
      return (
        <div className='activeLVP' style={{minWidth:'100%'}}>
          <div className='row col-md-12 d-flex justify-content-between'>
            <div className="table-wrapper-scroll-y my-custom-scrollbar col-md-12">
              <h4 className='text-center' style={{
                borderStyle: 'solid', borderWidth: '2px', background: 'green', color: 'white'
                , borderRadius: '2px'
              }}>L V Prasad Users Access Control</h4>
              <table className="table table-bordered mb-0">
                <thead>
                <tr>
                  <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Username</th>
                  <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Full Name</th>
                  <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Created On Date</th>
                  <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Created at Time</th>
                  <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Edit Details</th>
                  <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Manage</th>
                </tr>
                </thead>
                <tbody>
                {show}
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

ManageDiagUsers.propTypes = {
  auth: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  ControlDiagUsers: PropTypes.func.isRequired

}
const mapStateToProps = state => ({
  auth: state.auth,
  view: state.view
})
export default connect(mapStateToProps,{ControlDiagUsers})(ManageDiagUsers)