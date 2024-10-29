import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderList from "../components/OrderList";
import { Card, Col, Row, Spinner } from "react-bootstrap";

export default function ViewOrder() {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/users/order/${orderId}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(
                    "ecommercetoken"
                )}`,
            },
        })
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                console.log(data);
                let date = new Date(data.dateOrdered);
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
                setOrderDetails({
                    id: data._id,
                    dateOrdered: strDate,
                    orderStatus: data.orderStatus,
                    totalAmount: data.totalAmount.toFixed(2),
                    products: data.products,
                });
                setIsLoading(false);
            })
            .catch((error) => error);
    }, []);

    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="grow" />
                </div>
            ) : (
                <Row className="d-flex flex-column align-items-center">
                    <Col>
                        <h1 className="text-center my-5">View Order</h1>
                    </Col>
                    <Col md={10} className="mb-5">
                        <Card>
                            <Card.Body>
                                <Card.Title>Order Details</Card.Title>
                                <Card.Text>
                                    Date Ordered: {orderDetails.dateOrdered}
                                </Card.Text>
                                <Card.Text>
                                    Order Status: {orderDetails.orderStatus}
                                </Card.Text>
                                <Card.Text>
                                    Total Amount: {orderDetails.totalAmount}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={10}>
                        <OrderList productProp={orderDetails.products} />
                    </Col>
                </Row>
            )}
        </>
    );
}
