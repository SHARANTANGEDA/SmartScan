import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import MenuItem from '@material-ui/core/MenuItem';


import Slide from '@material-ui/core/Slide';


import './DwvComponent.css';
import dwv from 'dwv';
import getLocalDate from '../../utils/getLocalDate'

//
// dwv.utils.decodeQuery = dwv.utils.base.decodeQuery;
// dwv.gui.displayProgress = () => {};
// dwv.gui.getElement = dwv.gui.base.getElement;
// dwv.gui.refreshElement = dwv.gui.base.refreshElement;
//
// dwv.image.decoderScripts = {
//     "jpeg2000": "assets/dwv/decoders/pdfjs/decode-jpeg2000.js",
//     "jpeg-lossless": "assets/dwv/decoders/rii-mango/decode-jpegloss.js",
//     "jpeg-baseline": "assets/dwv/decoders/pdfjs/decode-jpegbaseline.js",
//     "rle": "assets/dwv/decoders/dwv/decode-rle.js"
// };
//
// const styles = theme => ({
//   button: {
//     margin: theme.spacing.unit,
//   },
//   appBar: {
//     position: 'relative',
//   },
//   title: {
//     flex: '0 0 auto',
//   },
//   tagsDialog: {
//     minHeight: '90vh', maxHeight: '90vh',
//     minWidth: '90vw', maxWidth: '90vw',
//   },
//   iconSmall: {
//     fontSize: 20,
//   }
// });
//
// const TransitionUp = props => <Slide direction="up" {...props} />

class DWVwithInfo extends Component {
  //
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     // versions: {
  //     //   dwv: dwv.getVersion(),
  //     //   react: React.version
  //     // },
  //     tools: ['Scroll', 'ZoomAndPan', 'WindowLevel', 'Draw'],
  //     selectedTool: 'Select Tool',
  //     loadProgress: 0,
  //     dataLoaded: false,
  //     dwvApp: null,
  //     tags: [],
  //     showDicomTags: false,
  //     toolMenuAnchorEl: null,
  //     image:null
  //   };
  //   this.onReset = this.onReset.bind(this)
  // }
  //
  // componentDidMount() {
  //   // create app
  //   let app = new dwv.App();
  //   // initialise app
  //   app.init({
  //     "containerDivId": "dwv",
  //     "tools": this.state.tools,
  //     "shapes": ["Ruler"],
  //     "isMobile": true
  //   });
  //
  //   app.loadImageObject([{name: "", filename: "",data:this.props.file.data}])
  //
  //   const ctx = this.refs.canvas.getContext('2d');
  //
  //   app.getImage().onload = () => {
  //     ctx.drawImage(app.getImage(),0,0);
  //   }
  //
  //   let self = this;
  //   app.addEventListener("load-progress", event => {
  //     self.setState({loadProgress: event.loaded});
  //   });
  //   app.addEventListener("load-end", event => {
  //     self.setState({dataLoaded: true});
  //     self.setState({tags: app.getTags()});
  //     if (app.isMonoSliceData() && app.getImage().getNumberOfFrames() === 1) {
  //       self.setState({selectedTool: 'ZoomAndPan'});
  //     } else {
  //       self.setState({selectedTool: 'Scroll'});
  //     }
  //   });
  //
  //   this.setState({dwvApp: app});
  // }
  //
  // onChangeTool = tool => {
  //   if ( this.state.dwvApp ) {
  //     this.setState({selectedTool: tool});
  //     this.state.dwvApp.onChangeTool({currentTarget: { value: tool } });
  //   }
  // }
  //
  //
  // handleMenuItemClick = tool => {
  //   this.setState({ toolMenuAnchorEl: null });
  //   this.onChangeTool(tool);
  // };
  // onReset () {
  //   if ( this.state.dwvApp ) {
  //     this.state.dwvApp.onDisplayReset();
  //   }
  // }
  render() {
    // const { tools } = this.state;
    const {patient} = this.props

    return (
      <div id="dwv">
        {/*<button onClick={this.onReset} className='btn btn-sm' style={{background: 'blue', color:'white'}}>Reset View</button>*/}
        {/*<div className="layerContainer">*/}
        {/*  <div className="dropBox"><Typography>Drag and drop data here.</Typography></div>*/}
        {/*  <canvas ref="canvas" className="imageLayer">Only for HTML5 compatible browsers...</canvas>*/}
        {/*  <img src={this.state.image} alt=''/>*/}
        {/*  <div className="drawDiv"></div>*/}
        {/*</div>*/}
        <table className="col-md-12" style={{ width: '100%' }}>
          <div className='row'>
            <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
              <td><h6 style={{color: 'grey',opacity:'0.9'}}>First Name:</h6></td>
              <td><h6>{patient.firstName}</h6></td>
            </div>
            <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
              <td><h6 style={{color: 'grey',opacity:'0.9'}}>Last Name:</h6></td>
              <td><h6>{patient.lastName}</h6></td>
            </div>
          </div>
          <div className='row' >
            <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
              <td><h6 style={{color: 'grey',opacity:'0.9'}}>Age/Gender:</h6></td>
              <td><h6>{patient.age+'/'+patient.gender}</h6></td>
            </div>
            <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
              <td><h6 style={{color: 'grey',opacity:'0.9'}}>Scan Type:</h6></td>
              <td><h6>{patient.scanType}</h6></td>
            </div>
          </div>
          <div className='row' >
            <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
              <td><h6 style={{color: 'grey',opacity:'0.9'}}>Organization email Address:</h6></td>
              <td><h6>{patient.orgEmail}</h6></td>
            </div>
            <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'5px'}}>
              <td><h6 style={{color: 'grey',opacity:'0.9'}}>uploaded At:</h6></td>
              <td><h6>{getLocalDate(patient.lastUploadAt)}</h6></td>
            </div>
          </div>
          <div className='row' >
            <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'10px'}}>
              <td><h6 style={{color: 'grey',opacity:'0.9'}}>uploaded by user:</h6></td>
              <td><h6>{patient.uploadedBy}</h6></td>
            </div>
            <div className='col-md-5 d-flex justify-content-between' style={{borderStyle:'groove', margin:'10px'}}>
              <td><h6 style={{color: 'grey',opacity:'0.9'}}>Remarks:</h6></td>
              <td><h6>{patient.remarks}</h6></td>
            </div>
          </div>
        </table>
      </div>
    );
  }
}

DWVwithInfo.propTypes = {
  // classes: PropTypes.object.isRequired,
  // file: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired
};

export default (DWVwithInfo);
