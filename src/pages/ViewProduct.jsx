import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-hot-toast";

import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";

export default function ViewProduct() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [productQuantity, setProductQuantity] = useState(1);
    const [subtotal, setSubtotal] = useState(0);
    const [productDetails, setIsProductDetails] = useState({
        id: null,
        productName: null,
        description: null,
        price: 0,
    });

    useEffect(() => {
        // console.log(productId);
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`)
            .then((result) => result.json())
            .then((data) => {
                setIsProductDetails({
                    id: data._id,
                    productName: data.productName,
                    description: data.description,
                    price: data.price,
                });
                setSubtotal(data.price * productQuantity);
                setIsLoading(false);
            })
            .catch((error) => error);
    }, []);

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

    const addToCart = (e) => {
        e.preventDefault;
        toast.success(
            `${productDetails.productName} has been added to your cart successfully`
        );
        setProductQuantity(1);
        let cartsArray = [];
        let foundUserIndex = -1;
        let productItem = {
            productId: productDetails.id,
            productName: productDetails.productName,
            priceSold: productDetails.price,
            quantity: productQuantity,
        };

        // console.log(localStorage.getdItem("ecommercecarts"));
        if (localStorage.getItem("ecommercecarts") !== null) {
            cartsArray = localStorage.getItem("ecommercecarts");
            cartsArray = JSON.parse(cartsArray);
            // console.log(cartsArray);
        }
        // console.log(user);
        foundUserIndex = cartsArray.findIndex((cart) => cart.id === user.id);
        // console.log(foundUserIndex);
        if (foundUserIndex >= 0) {
            // cartsArray[foundUserIndex].products.push(productItem);
            let foundProduct = false;
            cartsArray[foundUserIndex].products = cartsArray[
                foundUserIndex
            ].products.map((product) => {
                if (product.productId === productItem.productId) {
                    product.quantity = product.quantity + productItem.quantity;
                    foundProduct = true;
                }
                return product;
            });
            !foundProduct &&
                cartsArray[foundUserIndex].products.push(productItem);
        } else {
            cartsArray.push({
                id: user.id,
                products: [productItem],
            });
        }
        localStorage.setItem("ecommercecarts", JSON.stringify(cartsArray));
    };

    const handleUpdate = (e) => {
        e.preventDefault;
        navigate(`/updateproduct/${productId}`);
    };

    return isLoading ? (
        <Row className="text-center mt-5">
            <Col>
                <Spinner animation="grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Col>
        </Row>
    ) : (
        <>
            <Row className="mt-5 justify-content-center align-items-center d-flex">
                <Col xs={12} sm={8} lg={6}>
                    {/* <h1 className="my-5 text-center">
                        {productDetails.productName}
                    </h1> */}
                    {/* <p>{productId}</p> */}
                    {/* <p>{JSON.stringify(productDetails)}</p> */}
                    <Card className="mb-5 text-link">
                        <Card.Img
                            variant="top"
                            src="https://via.placeholder.com/600x400/222222/FFFFFF?text=Item"
                        />
                        <Card.Body>
                            <Card.Title>
                                {productDetails.productName}
                            </Card.Title>
                            <Card.Subtitle>
                                {productDetails.description}
                            </Card.Subtitle>
                            <Card.Text>
                                Php {productDetails.price.toFixed(2).toString()}
                            </Card.Text>
                            {user.isAdmin === false && (
                                <Form>
                                    <Form.Group className="mb-3 flex-row d-flex align-items-center justify-content-center">
                                        <Form.Label className="me-3">
                                            Quantity
                                        </Form.Label>
                                        <Button
                                            onClick={(e) =>
                                                handleProductQuantity(e, "-")
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
                                                handleProductQuantity(e, "+")
                                            }
                                        >
                                            +
                                        </Button>
                                    </Form.Group>
                                    <Card.Subtitle className="mt-3">
                                        Subtotal (Php)
                                    </Card.Subtitle>
                                    <Card.Text>{subtotal.toFixed(2)}</Card.Text>
                                    <Button onClick={addToCart}>
                                        Add to Cart
                                    </Button>
                                </Form>
                            )}
                            {user.isAdmin && (
                                <Button onClick={handleUpdate}>Update</Button>
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
        </>
    );
}
