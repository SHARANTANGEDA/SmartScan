import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// import Button from '@material-ui/core/Button';
// import LinearProgress from '@material-ui/core/LinearProgress';
// import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// import Link from '@material-ui/core/Link';
// import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
//
// import Dialog from '@material-ui/core/Dialog';
// import AppBar from '@material-ui/core/AppBar';
import Slide from '@material-ui/core/Slide';
// import Toolbar from '@material-ui/core/Toolbar';
//
// import TagsTable from './TagsTable';

import './DwvComponent.css';
import dwv from 'dwv';
import Spinner from '../common/Spinner'
// import { connect } from 'react-redux'
// import { logoutUser } from '../../actions/authActions'
// import { getSearchResults } from '../../actions/homeActions'
// import axios from 'axios';
// gui overrides

// decode query
dwv.utils.decodeQuery = dwv.utils.base.decodeQuery;
// progress
dwv.gui.displayProgress = () => {};
// get element
dwv.gui.getElement = dwv.gui.base.getElement;
// refresh element
dwv.gui.refreshElement = dwv.gui.base.refreshElement;

// Image decoders (for web workers)
dwv.image.decoderScripts = {
    "jpeg2000": "assets/dwv/decoders/pdfjs/decode-jpeg2000.js",
    "jpeg-lossless": "assets/dwv/decoders/rii-mango/decode-jpegloss.js",
    "jpeg-baseline": "assets/dwv/decoders/pdfjs/decode-jpegbaseline.js",
    "rle": "assets/dwv/decoders/dwv/decode-rle.js"
};

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  appBar: {
    position: 'relative',
  },
  title: {
    flex: '0 0 auto',
  },
  tagsDialog: {
    minHeight: '90vh', maxHeight: '90vh',
    minWidth: '90vw', maxWidth: '90vw',
  },
  iconSmall: {
    fontSize: 20,
  }
});

const TransitionUp = props => <Slide direction="up" {...props} />

class DwvComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // versions: {
      //   dwv: dwv.getVersion(),
      //   react: React.version
      // },
      tools: ['Scroll', 'ZoomAndPan', 'WindowLevel', 'Draw'],
      selectedTool: 'Select Tool',
      loadProgress: 0,
      dataLoaded: false,
      dwvApp: null,
      tags: [],
      showDicomTags: false,
      toolMenuAnchorEl: null,
      image:null
    };
    this.onReset = this.onReset.bind(this)
  }

  componentDidMount() {
    // create app
    let app = new dwv.App();
    // initialise app
    app.init({
      "containerDivId": "dwv",
      "tools": this.state.tools,
      "shapes": ["Ruler"],
      "isMobile": true
    });
    // // app.getImageData(this.props.file)
    // // app.setImage(this.props.file)
    // let dicomParser = new dwv.dicom.DicomParser();
    // dicomParser.parse(this.props.file.data);
    // let pixelBuffer = dicomParser.getRawDicomElements().x7FE00010.value;
    // let imageFactory = new dwv.image.ImageFactory();
    // let image = imageFactory.create(
    //   dicomParser.getDicomElements(),
    //   pixelBuffer );
    // let view = new dwv.image.View(image)
    // console.log({'Image Geo':image.getGeometry().getSize().getNumberOfColumns()})
    // console.log({ImageView: view.getImage()})
    // console.log({Image: image.getNumberOfFrames()})
    // app.loadFiles(image)
    // console.log({app: app.getImage()})
    // console.log({hello:  app.getImage()})
    // console.log(app.setImage(new Image(image)))
    // app.setImage(new Image(image))
    // this.setState({image:new Image(image)})
    // console.log({file:dicomParser.readPixelItemDataElement()})
    // progress
    app.loadImageObject([{name: "", filename: "",data:this.props.file.data}])

    const ctx = this.refs.canvas.getContext('2d');

    app.getImage().onload = () => {
      ctx.drawImage(app.getImage(),0,0);
    }

    let self = this;
    app.addEventListener("load-progress", event => {
      // console.log({progress:event.loaded})
      self.setState({loadProgress: event.loaded});
    });
    app.addEventListener("load-end", event => {
      // set data loaded flag
      self.setState({dataLoaded: true});
      // set dicom tags
      // console.log({event:event})
      self.setState({tags: app.getTags()});
      // set the selected tool
      if (app.isMonoSliceData() && app.getImage().getNumberOfFrames() === 1) {
        self.setState({selectedTool: 'ZoomAndPan'});
      } else {
        self.setState({selectedTool: 'Scroll'});
      }
    });
    // store
    // console.log({dwvApp: app.getImage()})
    this.setState({dwvApp: app});
  }

  onChangeTool = tool => {
    if ( this.state.dwvApp ) {
      // console.log({ChangeTool:tool})
      this.setState({selectedTool: tool});
      this.state.dwvApp.onChangeTool({currentTarget: { value: tool } });
    }
  }

  // onReset = tool => {
  //   if ( this.state.dwvApp ) {
  //     this.state.dwvApp.onDisplayReset();
  //   }
  // }
  //
  // handleTagsDialogOpen = () => {
  //   this.setState({ showDicomTags: true });
  // };
  //
  // handleTagsDialogClose = () => {
  //   this.setState({ showDicomTags: false });
  // };
  //
  // handleMenuButtonClick = event => {
  //   this.setState({ toolMenuAnchorEl: event.currentTarget });
  // };
  //
  // handleMenuClose = event => {
  //   this.setState({ toolMenuAnchorEl: null });
  // };

  handleMenuItemClick = tool => {
    this.setState({ toolMenuAnchorEl: null });
    this.onChangeTool(tool);
  };
  onReset () {
    if ( this.state.dwvApp ) {
      this.state.dwvApp.onDisplayReset();
    }
  }
  render() {
    const { classes } = this.props;
    const { tools, loadProgress, dataLoaded, tags, toolMenuAnchorEl } = this.state;

    const toolsMenuItems = tools.map( (tool) =>
      <MenuItem onClick={this.handleMenuItemClick.bind(this, tool)} key={tool} value={tool}>{tool}</MenuItem>
    );

    return (
      <div id="dwv" style={{margin:'0px', padding:'0px'}}>
        {/*<button onClick={this.onReset} className='btn btn-sm' style={{background: 'blue', color:'white'}}>Reset View</button>*/}
        <div className="layerContainer" style={{margin:'0px', padding:'0px', borderStyle:'solid'}}>
          <div className="dropBox"><Spinner/></div>
          <canvas ref="canvas" className="imageLayer" style={{height:'100%', padding:'0px', margin:'0px', borderStyle:'solid'}}>Only for HTML5 compatible browsers...</canvas>
          {/*<img src={this.state.image} alt=''/>*/}
          <div className="drawDiv" style={{height:'100%', padding:'0px', margin:'0px', borderStyle:'solid'}}></div>
        </div>
      </div>
    );
  }
}

DwvComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired
};

export default withStyles(styles)(DwvComponent);
// export default connect(mapStateToProps,)(DwvComponent)

//
// {/*<LinearProgress variant="determinate" value={loadProgress} />*/}
// {/*<div className="button-row">*/}
// {/*  <Button variant="contained" color="primary"*/}
// {/*    aria-owns={toolMenuAnchorEl ? 'simple-menu' : null}*/}
// {/*    aria-haspopup="true"*/}
// {/*    onClick={this.handleMenuButtonClick}*/}
// {/*    disabled={!dataLoaded}*/}
// {/*    className={classes.button}*/}
// {/*    size="medium"*/}
// {/*  >{ this.state.selectedTool }*/}
// {/*  <ArrowDropDownIcon className={classes.iconSmall}/></Button>*/}
// {/*  <Menu*/}
// {/*    id="simple-menu"*/}
// {/*    anchorEl={toolMenuAnchorEl}*/}
// {/*    open={Boolean(toolMenuAnchorEl)}*/}
// {/*    onClose={this.handleMenuClose}*/}
// {/*  >*/}
// {/*    {toolsMenuItems}*/}
// {/*  </Menu>*/}
//
// {/*  <Button variant="contained" color="primary"*/}
// {/*    disabled={!dataLoaded}*/}
// {/*    onClick={this.onReset}*/}
// {/*  >Reset</Button>*/}
//
// {/*  <Button variant="contained" color="primary"*/}
// {/*    onClick={this.handleTagsDialogOpen}*/}
// {/*    disabled={!dataLoaded}*/}
// {/*    className={classes.button}*/}
// {/*    size="medium">Tags</Button>*/}
// {/*  <Dialog*/}
// {/*    open={this.state.showDicomTags}*/}
// {/*    onClose={this.handleTagsDialogClose}*/}
// {/*    TransitionComponent={TransitionUp}*/}
// {/*    classes={{ paper: classes.tagsDialog }}*/}
// {/*    >*/}
// {/*      <AppBar className={classes.appBar}>*/}
// {/*        <Toolbar>*/}
// {/*          <IconButton color="inherit" onClick={this.handleTagsDialogClose} aria-label="Close">*/}
// {/*            <CloseIcon />*/}
// {/*          </IconButton>*/}
// {/*          <Typography variant="h6" color="inherit" className={classes.flex}>*/}
// {/*            DICOM Tags*/}
// {/*          </Typography>*/}
// {/*        </Toolbar>*/}
// {/*      </AppBar>*/}
// {/*      <TagsTable data={tags} />*/}
// {/*  </Dialog>*/}
// {/*</div>*/}
