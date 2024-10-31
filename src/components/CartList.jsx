import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";

export default function CartList({ cartItems, onChangeQuantity }) {
    const [cartList, setCartList] = useState([]);

    useEffect(() => {
        setCartList(
            cartItems.map((cartItem) => {
                return (
                    <Row key={cartItem.id}>
                        <Col xs={3} md={2}>
                            <Image
                                src="https://prd.place/200"
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
                                    <Card.Title>
                                        {cartItem.Product.name}
                                    </Card.Title>

                                    <Form>
                                        <Form.Group className="mb-3 flex-row d-flex align-items-center justify-content-center">
                                            <Form.Label className="me-3">
                                                Quantity
                                            </Form.Label>
                                            <Button
                                                onClick={(e) =>
                                                    onChangeQuantity(
                                                        e,
                                                        cartItem.id,
                                                        cartItem.quantity - 1
                                                    )
                                                }
                                            >
                                                -
                                            </Button>
                                            <Form.Control
                                                type="number"
                                                value={cartItem.quantity}
                                                onChange={(e) =>
                                                    onChangeQuantity(
                                                        e,
                                                        cartItem.id,
                                                        cartItem.quantity
                                                    )
                                                }
                                                className="mx-2 number-input"
                                                disabled
                                            />
                                            <Button
                                                onClick={(e) =>
                                                    onChangeQuantity(
                                                        e,
                                                        cartItem.id,
                                                        cartItem.quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </Button>
                                        </Form.Group>
                                    </Form>
                                    <Card.Text>
                                        {" "}
                                        PHP{" "}
                                        {cartItem.Product.price
                                            .toFixed(2)
                                            .toString()}{" "}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    Subtotal:{" "}
                                    {(
                                        cartItem.quantity *
                                        cartItem.Product.price
                                    ).toFixed(2)}
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                );
            })
        );
    }, [cartItems]);

    return <>{cartList}</>;
}
