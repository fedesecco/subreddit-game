import React from 'react';
import Header from '../components/Header';
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert';

import './App.css';


const App = () => {
  return (
    <div>
      <Header />
      <Button variant="primary">Primary</Button>
      <Alert key="primary" variant="primary">
        This is a primary alert—check it out!
      </Alert>
    </div>
  );
}


export default App;