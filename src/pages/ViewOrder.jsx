import { useLoaderData } from "react-router-dom";
import OrderList from "../components/OrderList";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import json from "superjson";
import { getCookie } from "../utils/cookieService";
import { useContext } from "react";
import { UserContext } from "../userContext";

export default function ViewOrder() {
    const order = useLoaderData();
    const { user } = useContext(UserContext);
    const date = order.createdAt;
    let strDate =
        date.getMonth() +
        1 +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();
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
                            <Card.Text>Date Ordered: {strDate}</Card.Text>
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
            Authorization: `Bearer ${getCookie("accessToken")}`,
        },
    })
        .then((result) => result.json())
        .then((serializedData) => json.deserialize(serializedData));
};
