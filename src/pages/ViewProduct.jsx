import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/esm/Button";
import Carousel from "react-bootstrap/Carousel";
import { toast } from "react-hot-toast";

import { useParams, Link, useNavigate, useLoaderData } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import json from "superjson";
import Cookies from "universal-cookie";
import Modal from "../components/Modal";
const cookies = new Cookies();
import "./viewProduct.scss";

export default function ViewProduct() {
    const productDetails = useLoaderData();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [isPending, setIsPending] = useState(false);
    const [productQuantity, setProductQuantity] = useState(1);
    const [subtotal, setSubtotal] = useState(0);
    useEffect(() => {
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
        } else {
            setSubtotal(productDetails.price * productQuantity);
        }
    }, [productQuantity]);

    const handleProductQuantity = (e, type) => {
        if (type === "input") {
            setProductQuantity(e.target.value);
        } else if (type === "+") {
            // console.log(productQuantity);
            setProductQuantity(Number(productQuantity) + 1);
        } else if (type === "-") {
            // console.log(productQuantity);
            setProductQuantity(productQuantity - 1);
        }
    };

    const addToCart = async (e) => {
        setIsPending(true);
        e.preventDefault;

        // setProductQuantity(1);
        const updateBody = {
            productId: productDetails.id,
            quantity: productQuantity,
        };
        await fetch(`${import.meta.env.VITE_API_URL}/carts`, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("accessToken")}`,
            },
            body: json.stringify(updateBody),
        });
        toast.success(
            `${productDetails.name} has been added to your cart successfully`
        );
        setIsPending(false);
    };

    const handleUpdate = (e) => {
        e.preventDefault;
        navigate(`/updateproduct/${productId}`);
    };

    return (
        <>
            <Modal>
                <main className="details">
                    <Row className="justify-content-center align-items-center d-flex px-2 pb-3">
                        <Col>
                            {/* <h1 className="my-5 text-center">
                        {productDetails.productName}
                    </h1> */}
                            {/* <p>{productId}</p> */}
                            {/* <p>{JSON.stringify(productDetails)}</p> */}
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
                                            <Button
                                                onClick={addToCart}
                                                disabled={isPending}
                                            >
                                                Add to Cart
                                            </Button>
                                        </Form>
                                    )}
                                    {user.role === "admin" && (
                                        <Button onClick={handleUpdate}>
                                            Update
                                        </Button>
                                    )}
                                    {!user.id && (
                                        <Card.Link as={Link} to="/login">
                                            Sign in and add to cart
                                        </Card.Link>
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
    console.log(params.productId);
    return await fetch(
        `${import.meta.env.VITE_API_URL}/products/product/${params.productId}`
    )
        .then((result) => result.json())
        .then((serializedData) => json.deserialize(serializedData))
        .catch((error) => error);
}
