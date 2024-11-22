import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import './HeroSection.scss'

export default function HeroSection() {
    return (
        <div
            className="hero-section text-dark d-flex align-items-center background-hero"
        >
            <Container>
                <Row>
                    <Col md={6} className="text-container">
                        <h1 className="display-4 fw-bold">
                            Discover the Best Deals on Top Brands
                        </h1>
                        <p className="lead mt-3">
                            Shop the latest collections and enjoy unbeatable
                            discounts on a wide range of products. Don't miss
                            out!
                        </p>
                        <div className="mt-4">
                            <Button
                                as={Link}
                                variant="warning"
                                size="lg"
                                href="/products"
                                to="/products"
                            >
                                Shop Now
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
