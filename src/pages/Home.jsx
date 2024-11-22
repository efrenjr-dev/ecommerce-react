import Orders from "./Orders";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useContext } from "react";
import { UserContext } from "../userContext";
import HeroSection from "../components/HeroSection";
import ProductSection from "../components/ProductSection";

export default function Home() {
    const { user } = useContext(UserContext);

    if (user.role === "admin") {
        return (
            <>
                <Row className="d-flex flex-column">
                    <Col>
                        <Orders take={10} title="Recent orders" />
                    </Col>
                    {/* <Col>
                    <Products take={3} title="Suggested products" />
                </Col> */}
                </Row>
            </>
        );
    }
    if (user.role === "user" || user.role == null) {
        return (
            <>
                <HeroSection />
                <Row className="d-flex flex-column">
                    <Col>
                        <ProductSection take={4} title="Suggested products" />
                    </Col>
                    {user.role === "user" && (
                        <Col>
                            <Orders
                                take={5}
                                title="Your recent orders"
                                user={user}
                            />
                        </Col>
                    )}
                </Row>
            </>
        );
    }
}
