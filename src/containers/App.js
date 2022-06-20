import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button, Alert, Container } from 'react-bootstrap';
import './App.scss';

function App() {
  const serverURL = 'https://lit-garden-12978.herokuapp.com/';
  const testURL = 'https://jsonplaceholder.typicode.com/users';
  const [users, setUsers] = useState([]);

  useEffect(()=> {
    fetch(testURL)
      .then(response=> response.json())
      .then(users => {setUsers(users)});
      // console.log(users);
  },[])

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