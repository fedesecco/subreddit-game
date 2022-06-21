import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button, Alert, Container } from 'react-bootstrap';
import './App.scss';
import users from '../testUsers';

function App() {
  const serverURL = 'https://lit-garden-12978.herokuapp.com/';
  const testURL = 'https://jsonplaceholder.typicode.com/users';
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  });
  const ID = 1;


  useEffect(() => {

  }, [])

  /*   useEffect(() => {
      fetch('../testUsers.js')
        .then(response => response.json())
        .then(users => { setUsers(users) });
      // console.log(users);
    }, []) */

  return (
    <div>
      <Header />
      <Container className="mt-5 pb-3"></Container>
      <Alert className="tc" key="primary" variant="primary">
        Test allerta
      </Alert>
    </div>
  );
}


export default App;