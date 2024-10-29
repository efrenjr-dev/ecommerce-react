import { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export default function OrderList({ productProp }) {
    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        if (productProp) {
            setOrderList(
                productProp.map((p) => {
                    return (
                        <Row key={p.productId}>
                            <Col xs={3} md={2}>
                                <Image
                                    src="https://via.placeholder.com/100x100/222222/FFFFFF?text=Image"
                                    rounded
                                    fluid
                                ></Image>
                            </Col>
                            <Col className="">
                                <Card className="mb-5 text-link">
                                    {/* <Card.Header>ID: {productProp.productId}</Card.Header> */}
                                    {/* <Card.Img
                variant="top"
                src="https://via.placeholder.com/100x50/222222/FFFFFF?text=Image"
            /> */}
                                    <Card.Body>
                                        <Card.Title>{p.productName}</Card.Title>
                                        <Card.Text>
                                            Quantity: {p.quantity}
                                        </Card.Text>
                                        <Card.Text>
                                            Php{" "}
                                            {p.priceSold.toFixed(2).toString()}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        Subtotal:{" "}
                                        {(p.quantity * p.priceSold).toFixed(2)}
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                    );
                })
            );
        }
    }, [productProp]);

    return <>{orderList}</>;
}
