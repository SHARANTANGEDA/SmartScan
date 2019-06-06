import React, { Component } from 'react'
import './App.css'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { logoutUser, setCurrentUser } from './actions/authActions'
import PrivateRoute from './components/common/PrivateRoute'
import { Provider } from 'react-redux'
import store from './store'
import Footer from './components/layout/Footer'
import NavBar from './components/layout/NavBar'
import Landing from './components/layout/Landing'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Register from './components/Register/Register'
import Dashboard from './components/dashboard/Dashboard'
import Sidebar from './components/layout/Sidebar'
import MyAccount from './components/MyAccount/MyAccount'
import ChangePassword from './components/MyAccount/ChangePassword'
import ContactUs from './components/common/ContactUs'
import UploadFiles from './components/upload/UploadFiles'
import Success from './components/upload/Success'
import Display from './components/display/Files/Display'


//Check for token
if(localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken)
  const decoded = jwt_decode(localStorage.jwtToken)
  store.dispatch(setCurrentUser(decoded))
  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser())
    window.location.href = '/'
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <Router>
      <div className="App">
        <NavBar/>
        <Route exact path="/" component={Landing}/>
        <Route exact path='/contactUs' component={ContactUs}/>

        <div className="wrapper" >
        <Route component={Sidebar}/>

        <div className="container">
          <Route exact path="/register" component={Register} />
          <Switch>
            <PrivateRoute exact path='/dashboard' component={Dashboard}/>
          </Switch>
            <Switch>
              <PrivateRoute exact path='/myAccount' component={MyAccount}/>
            </Switch>
            <Switch>
              <PrivateRoute exact path='/changePassword' component={ChangePassword}/>
            </Switch>
          <Switch>
            <PrivateRoute exact path='/displayFolder/:id' component={Display}/>
          </Switch>
          <Switch>
            <PrivateRoute exact path='/uploadMultipleFiles' component={UploadFiles}/>
          </Switch>
          <Switch>
            <PrivateRoute exact path='/uploadSuccess' component={Success}/>
          </Switch>
          </div>
        </div>
        <Footer/>
      </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
