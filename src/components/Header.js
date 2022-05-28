import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

function Header() {
    const handleSelect = (eventKey) => alert(`selected ${eventKey}`);

    return (
        <div>
            <h1>HELOOO</h1>
            {/* <Nav variant="pills" activeKey="1" onSelect={handleSelect}>
                <NavDropdown title="Dropdown" id="nav-dropdown">
                    <NavDropdown.Item eventKey="4.1">Action</NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
                </NavDropdown>
            </Nav> */}
            <Button variant="primary">Primary</Button>{' '}
        </div>
    );
}


export default Header;