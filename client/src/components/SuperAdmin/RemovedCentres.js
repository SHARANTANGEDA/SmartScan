import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import './scroll.css'
import Spinner from '../common/Spinner'
import { removedCentres } from '../../actions/sAActions'
import TableRowDiagActivity from './tableDisplay/TableRowDiagActivity'

class RemovedCentres extends Component {
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
    console.log({COMP: 'Mounted'})

    this.props.removedCentres(this.props.match.params.id)
    console.log({COMP: 'Mounted'})
  }

  render () {
    const {loading2, inActive} = this.props.view
    if (loading2 || inActive===null) {
      return (
        <Spinner/>
      )
    } else {
      let show, show2, renderpn=null
      const {  currentPage, todosPerPage } = this.state;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      const pageNumbers = [];

      if(inActive.length===0) {
        show=null
        show2=(<h3 className='row text-center'>There are no In Active Centres currently</h3>)
      }else {
        const currentFolder = inActive.slice(indexOfFirstTodo, indexOfLastTodo);
        const render = (  currentFolder.map(folder => (
          <TableRowDiagActivity data={folder} key={folder._id}/>
        )))
        for (let i = 1; i <= Math.ceil(inActive.length / todosPerPage); i++) {
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
        show2=null
      }
      return (
        <div className='removedCentres row table-wrapper-scroll-y my-custom-scrollbar'
             style={{minWidth:'100%'}}>
            <h3 className='text-center' style={{
              borderStyle: 'solid', borderWidth: '2px', background: 'green', color: 'white'
              , borderRadius: '2px'
            }}>InActive Diagnostic Centres</h3>
            <table className="table table-bordered mb-0 col-md-12"  style={{minWidth:'100%'}}>
              <thead className='col-md-12' style={{minWidth:'100%'}}>
              <tr>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>Centre Name</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>Short Code</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>User name</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>Full Name</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>Organization Email</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>Creation Date</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>Creation Time</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>Last Used Date</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>Last Used Time</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>Centre Users</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>No of Uploads</th>
                <th style={{ fontSize: '10pt', background:'#c1c1c1'}}>Re-Commission</th>
              </tr>
              </thead>
              {show}
            </table>
          <div className='d-flex justify-content-end'>
            {renderpn}
          </div>
            {show2}
        </div>
      )
    }
  }
}

RemovedCentres.propTypes = {
  auth: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  removedCentres: PropTypes.func.isRequired

}
const mapStateToProps = state => ({
  auth: state.auth,
  view: state.view
})
export default connect(mapStateToProps, {removedCentres})(RemovedCentres)