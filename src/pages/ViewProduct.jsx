import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import Carousel from "react-bootstrap/Carousel";
import { toast } from "react-hot-toast";

import { useNavigate, useLoaderData } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import json from "superjson";
import Modal from "../components/Modal";
import { getCookie } from "../utils/cookieService";
import { Badge } from "react-bootstrap";

export default function ViewProduct() {
    const productDetails = useLoaderData();
    const productInventory = productDetails.Product_Inventory.quantity;
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [isPending, setIsPending] = useState(false);
    const [productQuantity, setProductQuantity] = useState(1);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        if (user.role === "user") {
            if (productQuantity < 1) {
                toast.error("Quantity cannot be less than 1", {
                    id: "quantityToast",
                });
                setProductQuantity(1);
            } else if (productQuantity > 40) {
                toast.error("Quantity cannot be more than 40", {
                    id: "quantityToast",
                });
                setProductQuantity(40);
            } else if (productQuantity > productInventory) {
                toast.error(
                    `Quantity cannot be more than (${productInventory}) for this product`,
                    {
                        id: "quantityToast",
                    }
                );
                setProductQuantity(productInventory);
            } else {
                setSubtotal(productDetails.price * productQuantity);
            }
        }
    }, [productQuantity]);

    const handleProductQuantity = (e, type) => {
        if (type === "input") {
            setProductQuantity(e.target.value);
        } else if (type === "+") {
            setProductQuantity(Number(productQuantity) + 1);
        } else if (type === "-") {
            setProductQuantity(productQuantity - 1);
        }
    };

    const addToCart = async (e) => {
        setIsPending(true);
        e.preventDefault;

        const updateBody = {
            productId: productDetails.id,
            quantity: productQuantity,
        };
        await fetch(`${import.meta.env.VITE_API_URL}/carts`, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("accessToken")}`,
            },
            body: json.stringify(updateBody),
        });
        toast.success(
            `(${productDetails.name}) has been added to your cart successfully`
        );
        setIsPending(false);
    };

    const handleUpdate = (e) => {
        e.preventDefault;
        navigate(`/update-product/${productDetails.id}`);
    };
    const handleInventory = (e) => {
        e.preventDefault;
        navigate(`/product-inventory/${productDetails.id}`);
    };

    return (
        <>
            <Modal>
                <main>
                    <Row className="justify-content-center align-items-center d-flex px-2 pb-3">
                        <Col>
                            <Card className="text-link border-0">
                                <Carousel data-bs-theme="dark">
                                    <Carousel.Item>
                                        <Card.Img
                                            variant="top"
                                            src="https://prd.place/350?padding=50"
                                        />
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Card.Img
                                            variant="top"
                                            src="https://prd.place/350?padding=50"
                                        />
                                    </Carousel.Item>
                                </Carousel>
                                <Card.Body className="border-top">
                                    <Card.Title>
                                        {productDetails.name}
                                    </Card.Title>
                                    <Card.Subtitle>
                                        Php {productDetails.price}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        {productDetails.description}
                                    </Card.Text>
                                    {user.role === "user" && (
                                        <Form>
                                            <Form.Group className="mb-3 flex-row d-flex align-items-center justify-content-center">
                                                <Form.Label className="me-3">
                                                    Quantity
                                                </Form.Label>
                                                <Button
                                                    variant="secondary"
                                                    className="btn-sm"
                                                    disabled={isPending}
                                                    onClick={(e) =>
                                                        handleProductQuantity(
                                                            e,
                                                            "-"
                                                        )
                                                    }
                                                >
                                                    -
                                                </Button>
                                                <Form.Control
                                                    type="number"
                                                    value={productQuantity}
                                                    onChange={(e) =>
                                                        handleProductQuantity(
                                                            e,
                                                            "input"
                                                        )
                                                    }
                                                    className="mx-2 number-input"
                                                />

                                                <Button
                                                    variant="secondary"
                                                    className="btn-sm"
                                                    disabled={isPending}
                                                    onClick={(e) =>
                                                        handleProductQuantity(
                                                            e,
                                                            "+"
                                                        )
                                                    }
                                                >
                                                    +
                                                </Button>
                                            </Form.Group>
                                            <Card.Subtitle className="mt-3">
                                                Subtotal (Php)
                                            </Card.Subtitle>
                                            <Card.Text>
                                                {subtotal.toFixed(2)}
                                            </Card.Text>
                                            <div className="text-center">
                                                <Button
                                                    variant="outline-dark"
                                                    className="mx-1 mb-2 btn-sm"
                                                    onClick={() => {
                                                        navigate("/products");
                                                    }}
                                                    disabled={isPending}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    variant="warning"
                                                    className="mx-1 mb-2 btn-sm"
                                                    onClick={addToCart}
                                                    disabled={isPending}
                                                >
                                                    Add to Cart
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                    {user.role === "admin" && (
                                        <div>
                                            <Card.Text>
                                                Available stock:{" "}
                                                {productInventory > 10 ? (
                                                    productInventory
                                                ) : (
                                                    <Badge pill bg="danger">
                                                        {productInventory}
                                                    </Badge>
                                                )}
                                                <br />
                                                Status:{" "}
                                                {productDetails.isActive ? (
                                                    <span>Active</span>
                                                ) : (
                                                    <span className="text-danger">
                                                        Inactive
                                                    </span>
                                                )}
                                            </Card.Text>
                                            <div className="text-center">
                                                <Button
                                                    variant="outline-dark"
                                                    className="mx-1 mb-2 btn-sm"
                                                    onClick={() => {
                                                        navigate("/products");
                                                    }}
                                                    disabled={isPending}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    variant="dark"
                                                    className="mx-1 mb-2 btn-sm"
                                                    onClick={handleInventory}
                                                >
                                                    Inventory
                                                </Button>
                                                <Button
                                                    variant="dark"
                                                    className="mx-1 mb-2 btn-sm"
                                                    onClick={handleUpdate}
                                                >
                                                    Edit details
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    {!user.id && (
                                        <div className="text-center">
                                            <Button
                                                variant="outline-dark"
                                                className="mx-1 mb-2 btn-sm"
                                                onClick={() => {
                                                    navigate("/products");
                                                }}
                                                disabled={isPending}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                variant="warning"
                                                className="mx-1 mb-2 btn-sm"
                                                onClick={() => {
                                                    navigate("/login");
                                                }}
                                                disabled={isPending}
                                            >
                                                Sign in and add to cart
                                            </Button>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </main>
            </Modal>
        </>
    );
}

export async function loader({ params }) {
    return await fetch(
        `${import.meta.env.VITE_API_URL}/products/product/${params.productId}`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((serializedData) => json.deserialize(serializedData))
        .catch((error) => error);
}
