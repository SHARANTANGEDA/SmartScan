import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { Collapse } from 'react-collapse'
import Spinner from '../common/Spinner'
import PatientItem from '../display/Patients/PatientItem'

class LVPEIHomeFeed extends Component {
  constructor () {
    super()
    this.state = {
      isOpenToday: true,
      isOpenYesterday: true,
      isOpenLastWeek: true,
      isOpenLastMonth: true,
      isOpenPrevious: true,
      currentPage: 1,
      todosPerPage: 25
    }
    this.toggle = this.toggle.bind(this)
    this.toggle1 = this.toggle1.bind(this)
    this.toggle2 = this.toggle2.bind(this)
    this.toggle3 = this.toggle3.bind(this)
    this.toggle4 = this.toggle4.bind(this)
    this.handleClick = this.handleClick.bind(this);

  }
  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }
  componentDidMount () {
    // if(this.props.patients.today.length===0) {
    //   this.setState({isOpenToday: false })
    // }
    //
    // if(this.props.patients.yesterday.length===0) {
    //   this.setState({isOpenYesterday: false })
    // }
    // if(this.props.patients.lastweek.length===0) {
    //   this.setState({isOpenLastWeek: false })
    // }
    // if(this.props.patients.lastMonth.length===0) {
    //   this.setState({isOpenLastMonth: false })
    // }
    // if(this.props.patients.previous.length===0) {
    //   this.setState({isOpenPrevious: false })
    // }
  }

  toggle(e) {
    this.setState({isOpenToday: !this.state.isOpenToday})
  }
  toggle1(e) {
    this.setState({isOpenYesterday: !this.state.isOpenYesterday})
  }toggle2(e) {
    this.setState({isOpenLastWeek: !this.state.isOpenLastWeek})
  }toggle3(e) {
    this.setState({isOpenLastMonth: !this.state.isOpenLastMonth})
  }toggle4(e) {
    this.setState({isOpenPrevious: !this.state.isOpenPrevious})
  }

  render () {
    const { patients } = this.props
    const {  currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const pageNumbers = [];
    let content,renderpn=null;
    if(patients===null) {
      content=(<Spinner/>)
    } else {
      if(patients.length===0) {
        content=(
          <h5> Nothing is uploaded/modified in this time</h5>
        )
      }else {
        if (this.props.campusCode === 'all') {
        const currentFolder = patients.slice(indexOfFirstTodo, indexOfLastTodo);
        const render = ( currentFolder.map(folder => (
          <PatientItem patient={folder} key={folder.mrNo}/>
        )))
        for (let i = 1; i <= Math.ceil(patients.length / todosPerPage); i++) {
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
          content=(
            <tbody>
            {render}
            </tbody>
          )
          renderpn= (
            <nav aria-label="...">
              <ul className="pagination pagination-sm">
                {renderPageNumbers}
              </ul>
            </nav>
          )
      } else {
        let newFolders = patients.filter(folder => folder.centreCode === this.props.campusCode.toString())
        const currentFolder = newFolders.slice(indexOfFirstTodo, indexOfLastTodo);
        const render = ( currentFolder.map(folder => (
          <PatientItem patient={folder} key={folder.mrNo}/>
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
          content=(
            <tbody>
            {render}
            </tbody>
          )
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
      <div style={{width: '100%'}}>
        <div style={{width: '100%'}}>
          <table className="table table-bordered mb-0" >
            <thead>
            <tr>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Diag Centre</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>LVPEI Centre</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>MR No</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Patient Name</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Age/Gender</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Date of last upload</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Time of last upload</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>View</th>
              <th scope="col" style={{ fontSize: '10pt', background:'#c1c1c1'}}>Delete</th>
            </tr>
            </thead>
            {content}
          </table>
          <div className='d-flex justify-content-end'>
            {renderpn}
          </div>
        </div>
      </div>

    )
  }
}

LVPEIHomeFeed.defaultProps = {
  showActions: true
}
LVPEIHomeFeed.propTypes = {
  auth: PropTypes.object.isRequired,
  patients: PropTypes.array.isRequired,
  campusCode: PropTypes.string.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(mapStateToProps)(LVPEIHomeFeed)
