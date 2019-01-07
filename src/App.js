import React, { Component } from 'react';
import { Grommet } from 'grommet';
import Content from './components/Content';
import firebase from "firebase";


class App extends Component {

  app = firebase.initializeApp({
    apiKey: "AIzaSyAchTIkNwIjoi3digb_HH1wxp8MEa38VfA",
    authDomain: "lamparas11.firebaseapp.com",
    databaseURL: "https://lamparas11.firebaseio.com",
    projectId: "lamparas11",
    storageBucket: "lamparas11.appspot.com",
    messagingSenderId: "344068527809"
  });

  state = { loading: true, authenticated: false, user: null }

  componentWillMount() {
    this.app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false
        });
      }
    });
  }

  login(user, password) {
    console.log(user, password)
    this.app.auth().signInWithEmailAndPassword(user, password)
  }

  render() {
    return (
      <Grommet>
        { !this.state.authenticated && <Content login={ (user,password) => this.login(user, password) }/> } 
      </Grommet>
    );
  }
}

export default App;
