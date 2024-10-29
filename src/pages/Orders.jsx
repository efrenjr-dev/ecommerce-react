import { useContext, useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext";

export default function Orders() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        let ordersURL = `${import.meta.env.VITE_API_URL}/users/myOrders`;
        user.isAdmin &&
            (ordersURL = `${import.meta.env.VITE_API_URL}/users/allOrders`);
        console.log(ordersURL);
        fetch(ordersURL, {
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
                // console.log(data);
                data.reverse();
                setOrders(
                    data.map((order) => {
                        // console.log("order");
                        let date = new Date(order.dateOrdered);
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
                            <tr key={order._id}>
                                <td>{strDate}</td>
                                <td className="text-end">
                                    {order.totalAmount.toFixed(2)}
                                </td>
                                <td>{order.orderStatus}</td>
                                <td>
                                    <Button
                                        as={Link}
                                        to={`/order/${order._id}`}
                                        className="btn-sm"
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                );
                setIsLoading(false);
            })
            .catch((error) => {
                return `ERROR! ${error}`;
            });
        // console.log(orders);
    }, []);

    return (
        <>
            <Row className="d-flex flex-column justify-content-center">
                <Col>
                    <h1 className="text-center my-5">Orders</h1>
                </Col>
                <Col>
                    {isLoading ? (
                        <Spinner animation="grow" role="status" />
                    ) : orders.length < 1 ? (
                        <h5 className="text-center">
                            You do not have any orders.
                        </h5>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <td>Date Ordered</td>
                                    <td>Total Amount</td>
                                    <td>Order Status</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>{orders.length > 0 && orders}</tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </>
    );
}
