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
    let strDate = date.toLocaleString("en-US", {
        weekday: "long", // For day of the week (e.g., "Monday")
        year: "numeric", // For year (e.g., "2024")
        month: "long", // For full month name (e.g., "November")
        day: "numeric", // For the day of the month (e.g., "15")
        hour: "2-digit", // For hour (e.g., "3")
        minute: "2-digit", // For minute (e.g., "45")
        second: "2-digit", // For seconds (e.g., "00")
        hour12: true, // Use 12-hour format with AM/PM
    });
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
                                <p>Order number: {order.id.toString()}</p>
                                <p>Order date: {strDate}</p>
                                <p>Total amount: {order.total}</p>
                                <p>Customer name: {order.User.name}</p>
                                <p>Customer Id: {order.User.id}</p>
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
