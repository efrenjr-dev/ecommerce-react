import Products from "./Products";
import Orders from "./Orders";
import { Badge, Col, Row } from "react-bootstrap";
import { useContext } from "react";
import { UserContext } from "../userContext";

export default function Home() {
    const { user } = useContext(UserContext);

    if (user.role === "admin") {
        return (
            <>
                <section className=" text-center">
                    <h1 className="mt-5 pt-5">
                        <Badge bg="warning" className="shadow-sm">
                            E-Commerce App
                        </Badge>
                    </h1>
                    <h6 className="mb-5 text-dark">
                        A one-stop ecommerce website for all of your needs.
                    </h6>
                </section>
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
                <section className=" text-center">
                    <h1 className="mt-5 pt-5">
                        <Badge bg="warning" className="shadow-sm">
                            E-Commerce App
                        </Badge>
                    </h1>
                    <h6 className="mb-5 text-dark">
                        A one-stop ecommerce website for all of your needs.
                    </h6>
                </section>
                <Row className="d-flex flex-column">
                    <Col>
                        <Products take={4} title="Suggested products" />
                    </Col>
                    <Col>
                        <Orders take={5} title="Your recent orders" />
                    </Col>
                </Row>
            </>
        );
    }
}
