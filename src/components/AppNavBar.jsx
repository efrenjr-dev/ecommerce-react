import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext";
import { Badge } from "react-bootstrap";

export default function AppNavBar() {
    const { user } = useContext(UserContext);
    return (
        <>
            <Navbar collapseOnSelect expand="sm" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/" href="/">
                        <Badge bg="light" className="text-dark">
                            E-Commerce App
                        </Badge>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link hidden as={Link} to="/" href="/">
                                Home
                            </Nav.Link>
                            {user.role === "admin" ? (
                                <NavDropdown
                                    title="Products"
                                    id="collapsible-nav-dropdown-products"
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/products"
                                        href="/products"
                                    >
                                        View Products
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/addproduct"
                                        href="/addproduct"
                                    >
                                        Add Product
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link
                                    as={Link}
                                    to="/products"
                                    href="/products"
                                >
                                    Products
                                </Nav.Link>
                            )}
                            {/* </Nav>

                        <Nav> */}
                            {user.id && (
                                <Nav.Link as={Link} to="/orders" href="/orders">
                                    Orders
                                </Nav.Link>
                            )}
                            {user.id && user.role === "user" && (
                                <Nav.Link as={Link} to="/cart" href="/cart">
                                    <Badge bg="warning" className="text-dark fs-6">
                                        My Cart
                                    </Badge>
                                </Nav.Link>
                            )}
                            {user.id ? (
                                <Nav.Link as={Link} to="/logout" href="/logout">
                                    Logout
                                </Nav.Link>
                            ) : (
                                <Nav.Link as={Link} to="/login" href="/login">
                                    Login
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
