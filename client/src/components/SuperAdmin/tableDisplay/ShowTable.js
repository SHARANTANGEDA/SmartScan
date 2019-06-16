import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import TableRowLVPEI from './TableRowLVPEI'
import TableRowDiagAdmins from './TableRowDiagAdmins'
import TableRowUsers from '../../dashboard/TableRowUsers'

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
    }else if(index.type==='diag_admin_user') {
      return data.map(data => (
        <TableRowUsers data={data} key={data._id}/>
      ));
    }

  }
}

ShowTable.propTypes = {
  data: PropTypes.array.isRequired,
  index: PropTypes.object.isRequired
};

export default ShowTable;
