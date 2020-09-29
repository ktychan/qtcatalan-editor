import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';

import './index.scss';
import App from './App';

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCM-f_pFQIBsCzO7T5QFvo4_w_BrjPqjgM",
  authDomain: "qtcatalan.firebaseapp.com",
  databaseURL: "https://qtcatalan.firebaseio.com",
  projectId: "qtcatalan",
  storageBucket: "qtcatalan.appspot.com",
  messagingSenderId: "412480664766",
  appId: "1:412480664766:web:325fded35f4b5cb3309aef",
});


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);