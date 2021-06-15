import React from 'react'
import { Navbar, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
function Navs({setRoute,setUser}) {

  const logOut = ()=>{
    setUser(null)
    localStorage.removeItem("user")
  }
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
       
          <Navbar.Brand><img alt="logo" className="nav-logo" src={logo} /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick ={()=>setRoute("home")}>Home</Nav.Link>
              <Nav.Link onClick ={()=>setRoute("add-book")}>Add Book</Nav.Link>
              <Nav.Link onClick ={()=>setRoute("add-ex")}>Add Exercise</Nav.Link>
              <Nav.Link onClick ={()=>setRoute("code-gen")}>Code Generator</Nav.Link>
              <Nav.Link onClick ={logOut}>Çıkış</Nav.Link>
            </Nav>
          </Navbar.Collapse>
      
      </Navbar>
    )
}

export default Navs
