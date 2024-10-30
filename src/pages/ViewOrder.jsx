import { useLoaderData } from "react-router-dom";
import OrderList from "../components/OrderList";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import json from "superjson";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function ViewOrder() {
    const order = useLoaderData();
    return (
        <>
            <Row className="d-flex flex-column align-items-center">
                <Col>
                    <h1 className="text-center my-5">View Order</h1>
                </Col>
                <Col md={10} className="mb-5">
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Details</Card.Title>
                            <Card.Text>
                                Date Ordered: {order.createdAt.toString()}
                            </Card.Text>
                            <Card.Text>Total Amount: {order.total}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={10}>
                    <OrderList orderProp={order.Order_Item} />
                </Col>
            </Row>
        </>
    );
}

export const loader = async ({ params }) => {
    return fetch(`${import.meta.env.VITE_API_URL}/orders/${params.orderId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
    })
        .then((result) => result.json())
        .then((serializedData) => json.deserialize(serializedData));
};
