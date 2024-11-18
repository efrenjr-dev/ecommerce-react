import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext";
import { Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons/faSignOutAlt";
import { faUserGear } from "@fortawesome/free-solid-svg-icons/faUserGear";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons/faSignInAlt";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons/faBagShopping";
import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import { faCartFlatbed } from "@fortawesome/free-solid-svg-icons/faCartFlatbed";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons/faCircleUser";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons/faUserGroup";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons/faAddressBook";
import { faUserPen } from "@fortawesome/free-solid-svg-icons/faUserPen";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons/faFileInvoice";

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
                                    className="me-2"
                                    title={
                                        <>
                                            <FontAwesomeIcon
                                                icon={faBagShopping}
                                                className="me-2"
                                            />
                                            Products
                                        </>
                                    }
                                    id="collapsible-nav-dropdown-products"
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/products"
                                        href="/products"
                                    >
                                        <FontAwesomeIcon
                                            icon={faTags}
                                            className="me-2"
                                        />
                                        View Products
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/addproduct"
                                        href="/addproduct"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCartFlatbed}
                                            className="me-2"
                                        />
                                        Add Product
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link
                                    as={Link}
                                    to="/products"
                                    href="/products"
                                    className="me-2"
                                >
                                    <FontAwesomeIcon
                                        icon={faBagShopping}
                                        className="me-2"
                                    />
                                    Products
                                </Nav.Link>
                            )}
                            {/* </Nav>

                        <Nav> */}
                            {user.id && (
                                <Nav.Link
                                    as={Link}
                                    to="/orders"
                                    href="/orders"
                                    className="me-2"
                                >
                                    <FontAwesomeIcon
                                        icon={faFileInvoice}
                                        className="me-2"
                                    />
                                    Orders
                                </Nav.Link>
                            )}
                            {user.id && user.role === "admin" && (
                                <NavDropdown
                                    title={
                                        <>
                                            <FontAwesomeIcon
                                                icon={faUserGroup}
                                                className="me-2"
                                            />
                                            Users
                                        </>
                                    }
                                    id="collapsible-nav-dropdown-users"
                                    className="me-2"
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/users"
                                        href="/users"
                                    >
                                        <FontAwesomeIcon
                                            icon={faAddressBook}
                                            className="me-2"
                                        />
                                        View Users
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/adduser"
                                        href="/adduser"
                                    >
                                        <FontAwesomeIcon
                                            icon={faUserPen}
                                            className="me-2"
                                        />
                                        Create New User
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                            {user.id && user.role === "user" && (
                                <Nav.Link
                                    as={Link}
                                    to="/cart"
                                    href="/cart"
                                    className="me-2"
                                >
                                    <Badge
                                        bg="warning"
                                        className="text-dark fs-6"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCartShopping}
                                            className="me-2"
                                        />
                                        My Cart
                                    </Badge>
                                </Nav.Link>
                            )}
                            {user.id ? (
                                <NavDropdown
                                    title={
                                        <FontAwesomeIcon
                                            icon={faCircleUser}
                                            className="me-2"
                                        />
                                    }
                                    id="collapsible-nav-dropdown-account"
                                    className="me-2"
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/account"
                                        href="/account"
                                    >
                                        <FontAwesomeIcon
                                            icon={faUserGear}
                                            className="me-2"
                                        />
                                        My Account
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/logout"
                                        href="/logout"
                                    >
                                        <FontAwesomeIcon
                                            icon={faSignOutAlt}
                                            className="me-2"
                                        />
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link
                                    as={Link}
                                    to="/login"
                                    href="/login"
                                    className="me-2"
                                >
                                    <FontAwesomeIcon
                                        icon={faSignInAlt}
                                        className="me-2"
                                    />
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
