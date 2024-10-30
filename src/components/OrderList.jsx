import { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export default function OrderList({ orderProp }) {
    const [orderList, setOrderList] = useState([]);
    
    useEffect(() => {
        if (orderProp) {
            setOrderList(
                orderProp.map((order) => {
                    return (
                        <Row key={order.Product.id}>
                            <Col xs={3} md={2}>
                                <Image
                                    src="https://prd.place/200"
                                    rounded
                                    fluid
                                ></Image>
                            </Col>
                            <Col className="">
                                <Card className="mb-5 text-link">
                                    {/* <Card.Header>ID: {orderProp.productId}</Card.Header> */}
                                    {/* <Card.Img
                variant="top"
                src="https://via.placeholder.com/100x50/222222/FFFFFF?text=Image"
            /> */}
                                    <Card.Body>
                                        <Card.Title>{order.Product.name}</Card.Title>
                                        <Card.Text>
                                            Quantity: {order.quantity}
                                        </Card.Text>
                                        <Card.Text>
                                            Php{" "}
                                            {order.Product.price.toFixed(2).toString()}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        Subtotal:{" "}
                                        {(order.quantity * order.Product.price).toFixed(2)}
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                    );
                })
            );
        }
    }, [orderProp]);

    return <>{orderList}</>;
}
