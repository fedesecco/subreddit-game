import React from 'react';
import Header from '../components/Header';
import { Button, Alert, Container } from 'react-bootstrap';
import './App.scss';

const testVariable = "TEST";
const App = () => {
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