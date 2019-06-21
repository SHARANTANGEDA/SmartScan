import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Dashboard from '../../dashboard/Dashboard'
import ChangePassword from '../../MyAccount/ChangePassword'
import DisplayFolder from '../../display/Folders/DisplayFolder'
import Display from '../../display/Files/Display'
import CreateUsers from '../../MyAccount/CreateUsers'
import AddDiagnosticCentre from '../../SuperAdmin/AddDiagnosticCentre'
import Success from '../../upload/Success'
import NotFound from '../../NotFoundStarwars/NotFound'
import SearchNotFound from '../../layout/SearchNotFound'
import ActiveCentres from '../../SuperAdmin/ActiveCentres'
import RemovedCentres from '../../SuperAdmin/RemovedCentres'
import UploadForm from '../../upload/UploadForm'

const Routes = () => {
  return (

    <div className="container">
      <Switch>
        {/*<Switch>*/}
        <PrivateRoute exact path='/dashboard' component={Dashboard}/>
        {/*</Switch>*/}
        {/*  <Switch>*/}
        <PrivateRoute exact path='/changePassword' component={ChangePassword}/>
        {/*  </Switch>*/}
        {/*<Switch>*/}
        <PrivateRoute exact path='/displayFolder/:id' component={DisplayFolder}/>
        {/*</Switch>*/}
        {/*<Switch>*/}
        <PrivateRoute exact path='/displayFolder/displayFiles/:id' component={Display}/>
        {/*</Switch>*/}
        {/*<Switch>*/}
        <PrivateRoute exact path='/createUser' component={CreateUsers}/>
        {/*</Switch>*/}
        {/*<Switch>*/}
        <PrivateRoute exact path='/addDiagnosticCentre' component={AddDiagnosticCentre}/>
        {/*</Switch>*/}
        {/*<Switch>*/}
        <PrivateRoute exact path='/uploadSuccess' component={Success}/>
        <PrivateRoute exact path='/detailsNotFound' component={SearchNotFound}/>
        <PrivateRoute exact path='/activeCentres' component={ActiveCentres}/>
        <PrivateRoute exact path='/removedCentres' component={RemovedCentres} />
        <PrivateRoute exact path='/uploadForm' component={UploadForm}/>
        {/*</Switch>*/}
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
)}

export default Routes