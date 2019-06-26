import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import TableRowLVPEI from './TableRowLVPEI'
import TableRowDiagAdmins from './TableRowDiagAdmins'
import TableRowUsers from '../../dashboard/TableRowUsers'
import TableRowDiagActivity from './TableRowDiagActivity'
import TableRowDiagUser from './TableRowDiagUser'

class ShowTable extends Component {
  render() {
    const  {data,index}  = this.props;
    console.log({'DataFeed':data});
    if(index.type==='lvpei') {
      return data.map(data => (
        <TableRowLVPEI data={data} key={data._id}/>
      ));
    }
    else if(index.type==='centre') {
      return data.map(data => (
        <TableRowDiagAdmins data={data} key={data.user._id}/>
      ));
    }
    else if(index.type==='viewActivity') {
      return data.map(data => (
        <TableRowDiagActivity data={data} key={data._id}/>
      ));
    }
    else if(index.type==='manageDiagUser') {
      return data.map(data => (
        <TableRowDiagUser data={data} key={data._id}/>
      ));
    }

  }
}

ShowTable.propTypes = {
  data: PropTypes.array.isRequired,
  index: PropTypes.object.isRequired
};

export default ShowTable;
