import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4 mt-auto">
            <Container>
                <Row>
                    <Col md={8} className="mb-4 ms-auto">
                        <h5>About Us</h5>
                        <p>
                            We are a trusted online store providing the best
                            deals on a wide range of products. Shop with
                            confidence!
                        </p>
                    </Col>
                    <Col md={4} className="mb-4">
                        <h5>Quick Links</h5>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/" className="text-light">
                                FAQs
                            </Nav.Link>
                            <Nav.Link as={Link} to="/" className="text-light">
                                Terms & Conditions
                            </Nav.Link>
                            <Nav.Link as={Link} to="/" className="text-light">
                                Privacy Policy
                            </Nav.Link>
                        </Nav>
                    </Col>

                    {/* <Col md={3} className="mb-3">
                        <h5>Contact Us</h5>
                        <p>
                            <strong>Address:</strong> 1234 E-Commerce St,
                            Shopping City, SC 56789
                        </p>
                        <p>
                            <strong>Phone:</strong> (123) 456-7890
                        </p>
                        <p>
                            <strong>Email:</strong> support@ecommerce.com
                        </p>
                    </Col> */}
                </Row>
                <Row className="mt-4 border-top pt-3">
                    <Col md={6} className="text-center text-md-start">
                        &copy; {new Date().getFullYear()} E-Commerce. All Rights
                        Reserved.
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        <Nav className="justify-content-center justify-content-md-end">
                            <Nav.Link href="#" className="text-light">
                                Facebook
                            </Nav.Link>
                            <Nav.Link href="#" className="text-light">
                                Instagram
                            </Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
