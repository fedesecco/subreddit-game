import React from 'react';
import Header from '../components/Header';
import { Button, Alert } from 'react-bootstrap';
import './App.scss';


const App = () => {
  return (
    <div>
      <Header />
      <Alert className="tc" key="primary" variant="primary">
        This is a primary alert—check it out!
      </Alert>
    </div>
  );
}


export default App;