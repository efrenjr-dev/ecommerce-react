import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";

export default function CartList({ products, onChangeQuantity }) {
    const [cartList, setCartList] = useState([]);

    useEffect(() => {
        // console.log(products);
        setCartList(
            products.map((p) => {
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

                                    <Form>
                                        <Form.Group className="mb-3 flex-row d-flex align-items-center justify-content-center">
                                            <Form.Label className="me-3">
                                                Quantity
                                            </Form.Label>
                                            <Button
                                                onClick={(e) =>
                                                    onChangeQuantity(
                                                        e,
                                                        p.productId,
                                                        "-"
                                                    )
                                                }
                                            >
                                                -
                                            </Button>
                                            <Form.Control
                                                type="number"
                                                value={p.quantity}
                                                onChange={(e) =>
                                                    onChangeQuantity(
                                                        e,
                                                        p.productId,
                                                        "input"
                                                    )
                                                }
                                                className="mx-2 number-input"
                                                disabled
                                            />
                                            <Button
                                                onClick={(e) =>
                                                    onChangeQuantity(
                                                        e,
                                                        p.productId,
                                                        "+"
                                                    )
                                                }
                                            >
                                                +
                                            </Button>
                                        </Form.Group>
                                    </Form>
                                    <Card.Text>
                                        {" "}
                                        PHP {p.priceSold
                                            .toFixed(2)
                                            .toString()}{" "}
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
    }, [products]);

    return <>{cartList}</>;
}
