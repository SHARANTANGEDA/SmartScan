import React, { Component } from 'react'
import './App.css'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { logoutUser, setCurrentUser } from './actions/authActions'
import { Provider } from 'react-redux'
import store from './store'
import Footer from './components/layout/Footer'
import NavBar from './components/layout/NavBar'
import Landing from './components/layout/Landing'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Sidebar from './components/layout/Sidebar'
import ContactUs from './components/common/ContactUs'

import Routes from './components/common/Routes/Routes'


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
        <Switch>
        <Route exact path="/" component={Landing}/>
        <Route exact path='/contactUs' component={ContactUs}/>
        <div className="wrapper" >
        <Route component={Sidebar}/>
        <Route component={Routes}/>
        </div>
        </Switch>
        <Footer/>
      </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
