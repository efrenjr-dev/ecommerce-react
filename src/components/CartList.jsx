import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { debounce_leading } from "../utils/debounce";
import formatPrice from "../utils/formatPrice";

export default function CartList({ cartItems, onChangeQuantity, isLoading }) {
    const [cartList, setCartList] = useState([]);

    useEffect(() => {
        setCartList();
    }, [cartItems]);

    return (
        <>
            {cartItems.map((cartItem) => {
                return (
                    <Row key={cartItem.id}>
                        <Col xs={3} md={2}>
                            <Image
                                src={cartItem.Product.Image[0]?.url}
                                style={{
                                    objectFit: "cover",
                                }}
                                rounded
                                fluid
                            ></Image>
                        </Col>
                        <Col className="">
                            <Card className="mb-5 text-link">
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
                                                disabled={isLoading}
                                                variant="outline-dark"
                                                className="btn-sm"
                                                onClick={debounce_leading((e) =>
                                                    onChangeQuantity(
                                                        e,
                                                        cartItem.id,
                                                        cartItem.quantity - 1
                                                    )
                                                )}
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
                                                disabled={isLoading}
                                                variant="outline-dark"
                                                className="btn-sm"
                                                onClick={debounce_leading((e) =>
                                                    onChangeQuantity(
                                                        e,
                                                        cartItem.id,
                                                        cartItem.quantity + 1
                                                    )
                                                )}
                                            >
                                                +
                                            </Button>
                                        </Form.Group>
                                    </Form>
                                    <Card.Text>
                                        {formatPrice(cartItem.Product.price)}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    Subtotal:{" "}
                                    {formatPrice(
                                        cartItem.quantity *
                                            cartItem.Product.price
                                    )}
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                );
            })}
        </>
    );
}
