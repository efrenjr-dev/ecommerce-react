import { useEffect, useState } from "react";
import CartList from "../components/CartList";
import { toast } from "react-hot-toast";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import json from "superjson";
import { useNavigate, useLoaderData, Link } from "react-router-dom";
import { getCookie } from "../utils/cookieService";
import fetchWrapper from "../utils/fetchWrapper";

export default function Cart() {
    const shoppingCart = useLoaderData();
    const [cart, setCart] = useState(shoppingCart);
    const [cartItems, setCartItems] = useState();
    const [total, setTotal] = useState(shoppingCart.total);
    const navigate = useNavigate();

    const handleOrder = async (e) => {
        e.preventDefault;
        let loadingToast = toast.loading("Adding order");

        // console.log(order);
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
                }
            );
            const serializedData = await response.json();
            const data = json.deserialize(serializedData);
            if (data.code === 406) {
                toast.error(data.message, {
                    id: loadingToast,
                });
            } else {
                toast.success(data.message, {
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
        let loadingToast = toast.loading("Updating cart...");
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
                }
            )
                .then((result) => result.json())
                .then((serializedData) => json.deserialize(serializedData))
                .then((data) => {
                    setCart(data.updatedCart);
                    setTotal(data.cartTotal);
                    toast.dismiss(loadingToast);
                });
        } else {
            const updateBody = {
                quantity: quantity,
            };

            // setProductQuantity(1);

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
                }
            )
                .then((result) => result.json())
                .then((serializedData) => json.deserialize(serializedData))
                .then((data) => {
                    setCart(data.updatedCart);
                    setTotal(data.cartTotal);
                    toast.dismiss(loadingToast);
                });
        }
    };

    useEffect(() => {
        setCartItems(
            cart?.hasOwnProperty("Cart_Item") && cart.Cart_Item.length > 0 ? (
                <Row xs={1} md={2}>
                    <Col md={8}>
                        <CartList
                            cartItems={cart.Cart_Item}
                            onChangeQuantity={onChangeQuantity}
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
                                    variant="warning"
                                    onClick={handleOrder}
                                    className="d-flex ms-auto btn-sm"
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
            )
        );
    }, [cart]);

    return (
        <>
            <h3 className="text-center my-5">Shopping Cart</h3>
            {cartItems}
        </>
    );
}

export const loader = async () => {
    return await fetchWrapper(`${import.meta.env.VITE_API_URL}/carts`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
        },
    })
        .then((response) => response.json())
        .then((serializedData) => json.deserialize(serializedData));
};
