import { Link, useLoaderData } from "react-router-dom";
import OrderList from "../components/OrderList";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import json from "superjson";
import { getCookie } from "../utils/cookieService";
import { useContext } from "react";
import { UserContext } from "../userContext";
import { Button } from "react-bootstrap";

export default function ViewOrder() {
    const order = useLoaderData();
    const { user } = useContext(UserContext);
    const date = order.createdAt;
    let strDate = date.toLocaleString();
    return (
        <>
            <Row className="d-flex flex-column align-items-center">
                <Col>
                    <h4 className="text-center my-5">
                        {user.role === "user"
                            ? `Your order details are as below.`
                            : `Order details`}
                    </h4>
                </Col>
                <Col md={10} className="mb-5">
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Details</Card.Title>
                            <Card.Text>
                                Order number: {order.id.toString()}
                            </Card.Text>
                            <Card.Text>Order date: {strDate}</Card.Text>
                            <Card.Text>Total amount: {order.total}</Card.Text>
                            <Card.Text>
                                Customer name: {order.User.name}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={10}>
                    <OrderList orderProp={order.Order_Item} />
                </Col>
                <Col className="text-center mb-5">
                    <Link to="/orders">
                        <Button variant="dark">Back to Orders</Button>
                    </Link>
                </Col>
            </Row>
        </>
    );
}

export const loader = async ({ params }) => {
    return fetch(
        `${import.meta.env.VITE_API_URL}/orders/order/${params.orderId}`,
        {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: `Bearer ${getCookie("accessToken")}`,
            },
        }
    )
        .then((result) => result.json())
        .then((serializedData) => json.deserialize(serializedData));
};
