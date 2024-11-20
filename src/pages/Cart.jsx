import { useEffect, useState } from "react";
import CartList from "../components/CartList";
import { toast } from "react-hot-toast";
import { Button, Card, Col, Row, Spinner, Table } from "react-bootstrap";
import json from "superjson";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getCookie } from "../utils/cookieService";
import fetchWrapper from "../utils/fetchWrapper";

export default function Cart() {
    const [cart, setCart] = useState({ Cart_Item: [] });
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, setIsPending] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchWrapper(`${import.meta.env.VITE_API_URL}/carts`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("accessToken")}`,
            },
            navigate,
            location,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((serializedData) => json.deserialize(serializedData))
            .then((data) => {
                setCart(data);
                setIsPending(false);
            })
    }, []);

    useEffect(() => {
        let total = 0;
        cart.Cart_Item.forEach(
            (cartItem) => (total += cartItem.quantity * cartItem.Product.price)
        );
        setTotal(total);
    }, [cart]);

    const handleOrder = async (e) => {
        e.preventDefault;
        let loadingToast = toast.loading("Checking out...");
;
        try {
            const response = await fetchWrapper(
                `${import.meta.env.VITE_API_URL}/carts/checkout`,
                {
                    method: "POST",
                    mode: "cors",
                    credentials: "same-origin",
                    headers: {
                        Authorization: `Bearer ${getCookie("accessToken")}`,
                    },
                },
                navigate
            );
            const serializedData = await response.json();
            const data = json.deserialize(serializedData);
            if (data.code === 406) {
                toast.error(data.message, {
                    id: loadingToast,
                });
            } else {
                toast.success("Transaction successful!", {
                    id: loadingToast,
                });
                navigate(`/order/${data.order.id}`);
            }
        } catch (err) {
            toast.error(err.toString(), {
                id: loadingToast,
            });
        }
    };

    const onChangeQuantity = (e, cartItemId, quantity) => {
        e.preventDefault;
        setIsLoading(true);
        if (quantity < 1) {
            fetchWrapper(
                `${import.meta.env.VITE_API_URL}/carts/item/${cartItemId}`,
                {
                    method: "DELETE",
                    mode: "cors",
                    headers: {
                        Authorization: `Bearer ${getCookie("accessToken")}`,
                    },
                    navigate,
                    location,
                }
            )
                .then((result) => result.json())
                .then((serializedData) => json.deserialize(serializedData))
                .then((data) => {
                    setCart(data.updatedCart);
                    setTotal(data.cartTotal);
                    setIsLoading(false);
                });
        } else {
            const updateBody = {
                quantity: quantity,
            };

            fetchWrapper(
                `${import.meta.env.VITE_API_URL}/carts/item/${cartItemId}`,
                {
                    method: "PATCH",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getCookie("accessToken")}`,
                    },
                    body: json.stringify(updateBody),
                },
                navigate,
                location
            )
                .then((result) => result.json())
                .then((serializedData) => json.deserialize(serializedData))
                .then((data) => {
                    setCart(data.updatedCart);
                    setTotal(data.cartTotal);
                    setIsLoading(false);
                });
        }
    };

    return (
        <>
            <h3 className="text-center my-5">Shopping Cart</h3>
            {isPending ? (
                <div className="m-5 text-center">
                    <Spinner role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : cart?.hasOwnProperty("Cart_Item") &&
              cart.Cart_Item.length > 0 ? (
                <Row xs={1} md={2}>
                    <Col md={8}>
                        <CartList
                            cartItems={cart.Cart_Item}
                            onChangeQuantity={onChangeQuantity}
                            isLoading={isLoading}
                        />
                    </Col>
                    <Col md={4} className="justify-content-center">
                        <Card>
                            <Card.Body>
                                <Table borderless>
                                    <tbody>
                                        <tr>
                                            <td>Gross Amount</td>
                                            <td className="text-end">
                                                {(total * 0.88).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>VAT (12%)</td>
                                            <td className="text-end">
                                                {(total * 0.12).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr className="fw-bold border-top">
                                            <td>Total Amount</td>
                                            <td className="text-end">
                                                Php {total.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Button
                                    disabled={isLoading}
                                    variant="warning"
                                    onClick={handleOrder}
                                    className="d-flex ms-auto"
                                >
                                    Checkout
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <h6 className="text-center">
                    Your cart is empty. Please browse our{" "}
                    <Link to="/products">products</Link>.
                </h6>
            )}
        </>
    );
}