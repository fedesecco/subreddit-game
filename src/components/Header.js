import React, { useState } from 'react';
import { Button, Alert, Nav, Navbar, NavDropdown, Container, Offcanvas, Form, FormControl } from 'react-bootstrap';
import './Header.scss';
import subredditGameLogo from '../img/icon2.png';

function Header() {
    const headerSize = "lg";
    const websiteURL = "https://subredditgame.netlify.app/";
    return (
        <div id="Header">
            <Navbar key={headerSize} bg="light" expand={headerSize} className="mb-4" variant="primary" fixed="top">
                <Container fluid>
                    <Navbar.Brand href={`${websiteURL}`}>
                        <img src={subredditGameLogo} width="30" height="30" className="d-inline-block align-top" alt="Subreddit game logo" />
                    </Navbar.Brand>
                    <Navbar.Brand href={`${websiteURL}`} rel="noreferrer noopener" target="_blank" >Subreddit game</Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${headerSize}`} />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-${headerSize}`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-${headerSize}`}
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${headerSize}`}>
                                Offcanvas
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                {/* <NavDropdown title="Account-name" id={`offcanvasNavbarDropdown-expand-${headerSize}`}>
                                    <NavDropdown.Item href="#action3">Profile</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action4">Logout/Login/Register</NavDropdown.Item>
                                </NavDropdown> */}
                                <Nav.Link href="#action1">Account-name</Nav.Link>
                                <Nav.Link href="#action1">Logout/Login</Nav.Link>
                                <NavDropdown
                                    title="Dropdown"
                                    id={`offcanvasNavbarDropdown-expand-${headerSize}`}
                                >
                                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action4">
                                        Another action
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action5">
                                        Something else here
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </div>
    );
}


export default Header;